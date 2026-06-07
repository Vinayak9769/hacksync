import { URLSearchParams } from "url"
import { DynamicTool } from "@langchain/core/tools"
import { StateGraph, END, START, Annotation } from "@langchain/langgraph"

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

const serpApiSearch = async (query: string): Promise<SearchItem[]> => {
  const key = getEnv("SERPAPI_API_KEY")
  const params = new URLSearchParams({
    engine: "google",
    q: query,
    api_key: key
  })
  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(`SerpApi search failed: ${message}`)
  }
  const data = await response.json()
  return (data.organic_results || []).map((item: any) => ({
    title: item.title || "",
    link: item.link || "",
    snippet: item.snippet || ""
  }))
}

const searchTool = new DynamicTool({
  name: "serpapi_domain_search",
  description: "Search SerpApi for a query and return result snippets",
  func: async (query: string) => {
    const results = await serpApiSearch(query)
    return JSON.stringify(results)
  }
})

const buildQuery = (useCase: string, domain: string) => `site:${domain} "${useCase}"`

const AgentStateAnnotation = Annotation.Root({
  useCase: Annotation<string>(),
  domains: Annotation<string[]>(),
  evidence: Annotation<EvidenceItem[]>(),
  verified: Annotation<boolean>(),
  confidence: Annotation<number>(),
})

const buildAgent = () => {
  const graph = new StateGraph(AgentStateAnnotation)
    .addNode("searchDomains", async (state) => {
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
    .addNode("verify", (state) => {
      const totalMatches = state.evidence.reduce(
        (sum: number, item: EvidenceItem) => sum + item.matchCount,
        0
      )
      const verified = totalMatches > 0
      const confidence = Math.min(1, totalMatches / (state.domains.length * 3))
      return { verified, confidence }
    })
    .addEdge(START, "searchDomains")
    .addEdge("searchDomains", "verify")
    .addEdge("verify", END)

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
