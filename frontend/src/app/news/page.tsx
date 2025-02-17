import { Suspense } from "react"
import PubMedCategories from "../PubMedCategories"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Latest PubMed Categories</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <PubMedCategories />
      </Suspense>
    </main>
  )
}

function LoadingSkeleton() {
  return (
    <>
      {[1, 2].map((_, categoryIndex) => (
        <div key={categoryIndex} className="mb-12">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, paperIndex) => (
              <Skeleton key={paperIndex} className="h-48 w-full" />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

