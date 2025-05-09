'use client'

import type { Tables } from '@liam-hq/db/supabase/database.types'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type ReviewIssue = Tables<'ReviewIssue'> & {
  suggestionSnippets: Array<{
    id: number
    filename: string
    snippet: string
  }>
}

type ReviewIssuesContextType = {
  issues: ReviewIssue[]
  updateIssue: (issueId: number, updates: Partial<ReviewIssue>) => void
}

const ReviewIssuesContext = createContext<ReviewIssuesContextType | undefined>(
  undefined,
)

export const useReviewIssues = () => {
  const context = useContext(ReviewIssuesContext)
  if (!context) {
    throw new Error(
      'useReviewIssues must be used within a ReviewIssuesProvider',
    )
  }
  return context
}

type ReviewIssuesProviderProps = {
  initialIssues: ReviewIssue[]
  children: ReactNode
}

export const ReviewIssuesProvider = ({
  initialIssues,
  children,
}: ReviewIssuesProviderProps) => {
  const [issues, setIssues] = useState<ReviewIssue[]>(initialIssues)

  // Update issues when initialIssues changes
  useEffect(() => {
    setIssues(initialIssues)
  }, [initialIssues])

  const updateIssue = (issueId: number, updates: Partial<ReviewIssue>) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId ? { ...issue, ...updates } : issue,
      ),
    )
  }

  return (
    <ReviewIssuesContext.Provider value={{ issues, updateIssue }}>
      {children}
    </ReviewIssuesContext.Provider>
  )
}
