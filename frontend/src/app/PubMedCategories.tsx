
"use client"

import { useState, useEffect } from "react"
import PaperCard from "../components/PaperCard"
import { Skeleton } from "@/components/ui/skeleton"

interface Paper {
  id: string
  title: string
  abstract: string | null
  authors: string[]
  publicationDate: string
  url: string
}

interface Category {
  name: string
  papers: Paper[]
}

async function fetchAndCategorizePapers(): Promise<Category[]> {
  // Simulate API call delay

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get_news`, {
    cache: "no-store", // Prevents caching in Next.js
  });
  const data: Category[] = await response.json();

  
  // In a real-world scenario, you would fetch data from PubMed and use an LLM to categorize here
  return data;
}

function Section({
  category,
  expandedCards,
  toggleCardExpansion,
}: {
  category: Category
  expandedCards: Record<string, boolean>
  toggleCardExpansion: (id: string) => void
}) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.papers.map((paper) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            isExpanded={expandedCards[paper.id] || false}
            toggleExpansion={() => toggleCardExpansion(paper.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default function PubMedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAndCategorizePapers()
      .then((data) => {
        setCategories(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching data:", err)
        setError("Failed to load papers. Please try again later.")
        setIsLoading(false)
      })
  }, [])

  const toggleCardExpansion = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <>
      {categories.map((category) => (
        <Section
          key={category.name}
          category={category}
          expandedCards={expandedCards}
          toggleCardExpansion={toggleCardExpansion}
        />
      ))}
    </>
  )
}

function LoadingSkeleton() {
  return (
    <>
      {[1, 2].map((_, categoryIndex) => (
        <div key={categoryIndex} className="mb-12">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, paperIndex) => (
              <Skeleton key={paperIndex} className="h-48 w-full" />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
