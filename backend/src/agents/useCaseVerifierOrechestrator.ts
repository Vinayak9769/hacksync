import { URLSearchParams } from "url"
import { DynamicTool } from "@langchain/core/tools"
import { StateGraph, END } from "@langchain/langgraph"

type SearchItem = {
  title: string
  link: string
  snippet: string
}

type EvidenceItem = {
  domain: string
  query: string
  matchCount: number
  results: SearchItem[]
}

type VerificationResult = {
  useCase: string
  verified: boolean
  confidence: number
  evidence: EvidenceItem[]
  checkedAt: string
}

type AgentState = {
  useCase: string
  domains: string[]
  evidence: EvidenceItem[]
  verified: boolean
  confidence: number
}

const DOMAINS = [
  "nist.gov",
  "who.int",
  "nature.com",
  "acm.org",
  "ieee.org",
  "arxiv.org",
  "cdc.gov",
  "oecd.org"
]

const getEnv = (name: string) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

const googleSearch = async (query: string): Promise<SearchItem[]> => {
  const key = getEnv("GOOGLE_API_KEY")
  const cx = getEnv("GOOGLE_CX")
  const params = new URLSearchParams({
    key,
    cx,
    q: query
  })
  const response = await fetch(`https://customsearch.googleapis.com/customsearch/v1?${params.toString()}`)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Google search failed: ${message}`)
  }
  const data = await response.json()
  return (data.items || []).map((item: any) => ({
    title: item.title || "",
    link: item.link || "",
    snippet: item.snippet || ""
  }))
}

const searchTool = new DynamicTool({
  name: "google_domain_search",
  description: "Search Google Custom Search for a query and return result snippets",
  func: async (query: string) => {
    const results = await googleSearch(query)
    return JSON.stringify(results)
  }
})

const buildQuery = (useCase: string, domain: string) => `site:${domain} "${useCase}"`

const buildAgent = () => {
  const graph = new StateGraph<AgentState>({
    channels: {
      useCase: { value: (value: string) => value, default: "" },
      domains: { value: (value: string[]) => value, default: [] },
      evidence: { value: (value: EvidenceItem[]) => value, default: [] },
      verified: { value: (value: boolean) => value, default: false },
      confidence: { value: (value: number) => value, default: 0 }
    }
  })

  graph.addNode("searchDomains", async (state: AgentState) => {
    const evidence: EvidenceItem[] = []
    for (const domain of state.domains) {
      const query = buildQuery(state.useCase, domain)
  const response = (await searchTool.invoke(query)) as string
  const parsed = JSON.parse(response) as SearchItem[]
      evidence.push({
        domain,
        query,
        matchCount: parsed.length,
        results: parsed.slice(0, 3)
      })
    }
    return { evidence }
  })

  graph.addNode("verify", (state: AgentState) => {
    const totalMatches = state.evidence.reduce(
      (sum: number, item: EvidenceItem) => sum + item.matchCount,
      0
    )
    const verified = totalMatches > 0
    const confidence = Math.min(1, totalMatches / (state.domains.length * 3))
    return { verified, confidence }
  })

  graph.setEntryPoint("searchDomains")
  graph.addEdge("searchDomains", "verify")
  graph.addEdge("verify", END)

  return graph.compile()
}

export const verifyUseCaseWithLangGraph = async (useCase: string): Promise<VerificationResult> => {
  const agent = buildAgent()
  const result = await agent.invoke({
    useCase,
    domains: DOMAINS,
    evidence: [],
    verified: false,
    confidence: 0
  })

  return {
    useCase,
    verified: result.verified,
    confidence: result.confidence,
    evidence: result.evidence,
    checkedAt: new Date().toISOString()
  }
}

const run = async () => {
  const input = process.argv.slice(2).join(" ").trim()
  if (!input) {
    console.error("Provide a use case string")
    process.exit(1)
  }
  const result = await verifyUseCaseWithLangGraph(input)
  console.log(JSON.stringify(result, null, 2))
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
