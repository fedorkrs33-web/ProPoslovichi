export type Proverb = {
    id: string
    text: string
    language?: string
    translation?: string
    meaning?: string
    origin?: string
    createdAt: string
    author?: {
      id: string
      name: string | null
      email: string | null
    } | null
  }
  
  export type AiAnalysis = {
    summary: string
    culturalContext?: string
    usageExample?: string
    relatedProverbs?: string
    modelUsed: string
  }
  