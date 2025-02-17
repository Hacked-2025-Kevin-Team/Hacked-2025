import PaperCard from "../components/PaperCard"

interface Paper {
  id: string
  title: string
  abstract: string
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
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In a real-world scenario, you would fetch data from PubMed and use an LLM to categorize here
  return [
    {
      name: "Machine Learning in Healthcare",
      papers: [
        {
          id: "1",
          title: "Deep Learning for Medical Image Analysis",
          abstract:
            "This paper explores the application of deep learning techniques in medical image analysis. We discuss various architectures and their effectiveness in tasks such as tumor detection and classification of radiographic images.",
          authors: ["John Doe", "Jane Smith"],
          publicationDate: "2023-05-15",
          url: "https://example.com/paper1",
        },
        {
          id: "2",
          title: "AI-Driven Diagnosis of Rare Diseases",
          abstract:
            "Artificial intelligence is revolutionizing the diagnosis of rare diseases by analyzing complex patterns in patient data. This study presents a novel approach using ensemble learning to improve accuracy in identifying uncommon genetic disorders.",
          authors: ["Alice Johnson", "Bob Williams"],
          publicationDate: "2023-05-20",
          url: "https://example.com/paper2",
        },
        // Add more papers...
      ],
    },
    {
      name: "Genomics and Personalized Medicine",
      papers: [
        {
          id: "3",
          title: "Advances in CRISPR Gene Editing for Rare Diseases",
          abstract:
            "Recent developments in CRISPR technology show promising results for treating rare genetic disorders. This paper reviews the latest clinical trials and discusses ethical considerations in human gene editing.",
          authors: ["Emma Brown", "David Lee"],
          publicationDate: "2023-06-02",
          url: "https://example.com/paper3",
        },
        {
          id: "4",
          title: "Pharmacogenomics: Tailoring Treatment to Genetic Profiles",
          abstract:
            "This study explores how genetic variations influence individual responses to medications. We present a comprehensive analysis of drug-gene interactions and propose a framework for integrating pharmacogenomic data into clinical decision-making.",
          authors: ["Grace Chen", "Frank Taylor"],
          publicationDate: "2023-06-10",
          url: "https://example.com/paper4",
        },
        // Add more papers...
      ],
    },
    // Add more categories...
  ]
}

function Section({ category }: { category: Category }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </div>
  )
}

export default async function PubMedCategories() {
  const categories = await fetchAndCategorizePapers()

  return (
    <>
      {categories.map((category) => (
        <Section key={category.name} category={category} />
      ))}
    </>
  )
}

