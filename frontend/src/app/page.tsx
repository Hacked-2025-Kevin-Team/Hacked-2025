import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookmarkPlus, AlertTriangle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Stay Ahead with Cutting-Edge Research
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Get real-time updates on the latest research papers in your field. Discover groundbreaking insights
                  and stay informed effortlessly.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter a research topic" type="text" />
                  <Button type="submit">Search</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Popular topics: Physics, Biology, Computer Science, Psychology
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Latest Research Papers</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Quantum Entanglement in Macroscopic Systems</CardTitle>
                  <Badge>Physics</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This groundbreaking paper explores the phenomenon of quantum entanglement in larger, macroscopic
                    systems, challenging our understanding of quantum mechanics at scale.
                  </p>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Key Insights:</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Demonstration of entanglement in systems containing millions of particles</li>
                      <li>Potential applications in quantum computing and communication</li>
                      <li>New theoretical framework for understanding macroscopic quantum phenomena</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Read Full Paper</Button>
                  <Button variant="ghost">
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Save for Later
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI-Driven Drug Discovery: A New Frontier</CardTitle>
                  <Badge>Computer Science</Badge>
                  <Badge>Biology</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This paper presents a novel AI approach to accelerate drug discovery, combining machine learning
                    with molecular dynamics simulations to predict drug efficacy and side effects.
                  </p>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Key Insights:</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>50% reduction in early-stage drug development time</li>
                      <li>Improved accuracy in predicting drug-protein interactions</li>
                      <li>Potential to revolutionize personalized medicine</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Read Full Paper</Button>
                  <Button variant="ghost">
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Save for Later
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>The Impact of Social Media on Adolescent Mental Health</CardTitle>
                  <Badge>Psychology</Badge>
                  <div className="flex items-center mt-2 text-yellow-500">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Exercise caution: Small sample size</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This study examines the relationship between social media use and mental health outcomes in
                    adolescents, highlighting both positive and negative effects.
                  </p>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Key Insights:</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Correlation between excessive social media use and increased anxiety</li>
                      <li>Positive effects on social connection and support networks</li>
                      <li>Recommendations for healthy social media habits</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Read Full Paper</Button>
                  <Button variant="ghost">
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Save for Later
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 ResearchPulse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

