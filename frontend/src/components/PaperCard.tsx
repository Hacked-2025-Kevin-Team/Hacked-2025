"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react"

interface Paper {
  id: string
  title: string
  abstract: string
  authors: string[]
  publicationDate: string
  url: string
}

export default function PaperCard({ paper }: { paper: Paper }) {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)

  const handleLike = () => setLikes(likes + 1)
  const handleDislike = () => setDislikes(dislikes + 1)

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg">{paper.title}</CardTitle>
        <CardDescription className="text-sm">
          {paper.authors.join(", ")} - {paper.publicationDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{paper.abstract}</p>
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
          <Button variant="outline" size="sm" onClick={handleLike}>
            <ThumbsUp className="mr-1 h-4 w-4" /> {likes}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDislike}>
            <ThumbsDown className="mr-1 h-4 w-4" /> {dislikes}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

