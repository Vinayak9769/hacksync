import { URLSearchParams } from "url"

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

const DOMAINS = [
  "nist.gov",
  "who.int",
  "nature.com",
  "acm.org",
  "ieee.org",
  "arxiv.org",
  "cdc.gov",
  "oecd.org",
  "bbc.com",
  "theguardian.com",
  "reuters.com",
  "techcrunch.com",
  "wired.com"
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

const buildQuery = (useCase: string, domain: string) => `site:${domain} "${useCase}"`

export const verifyUseCase = async (useCase: string): Promise<VerificationResult> => {
  const evidence: EvidenceItem[] = []
  for (const domain of DOMAINS) {
    const query = buildQuery(useCase, domain)
    const results = await googleSearch(query)
    evidence.push({
      domain,
      query,
      matchCount: results.length,
      results: results.slice(0, 3)
    })
  }

  const totalMatches = evidence.reduce((sum, item) => sum + item.matchCount, 0)
  const verified = totalMatches > 0
  const confidence = Math.min(1, totalMatches / (DOMAINS.length * 3))

  return {
    useCase,
    verified,
    confidence,
    evidence,
    checkedAt: new Date().toISOString()
  }
}

const run = async () => {
  const input = process.argv.slice(2).join(" ").trim()
  if (!input) {
    console.error("Provide a use case string")
    process.exit(1)
  }
  const result = await verifyUseCase(input)
  console.log(JSON.stringify(result, null, 2))
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
