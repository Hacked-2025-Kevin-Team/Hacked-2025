"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThumbsUp, ThumbsDown, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

interface Paper {
  id: string
  title: string
  abstract: string | null
  authors: string[]
  publicationDate: string
  url: string
}

interface PaperCardProps {
  paper: Paper
  isExpanded: boolean
  toggleExpansion: () => void
}

export default function PaperCard({ paper, isExpanded, toggleExpansion }: PaperCardProps) {
  const truncateAbstract = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const abstractText = paper.abstract || "Abstract not available."
  const isLongAbstract = abstractText.length > 150

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg">{paper.title}</CardTitle>
        <CardDescription className="text-sm">
          {paper.authors.join(", ")} - {paper.publicationDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="mb-4 flex-grow">
          <p className="text-sm text-muted-foreground transition-all duration-300 ease-in-out">
            {isExpanded ? abstractText : truncateAbstract(abstractText, 150)}
          </p>
          {isLongAbstract && (
            <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto font-normal" onClick={toggleExpansion}>
              {isExpanded ? (
                <>
                  Show Less <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Read More <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
        <Link
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center"
        >
          Read Paper <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <ThumbsUp className="mr-1 h-4 w-4" /> 0
          </Button>
          <Button variant="outline" size="sm">
            <ThumbsDown className="mr-1 h-4 w-4" /> 0
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

