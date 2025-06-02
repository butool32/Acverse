import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="container px-4">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Collections</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Explore our curated collections of premium products designed for every lifestyle.
            </p>

            <div className="bg-muted/30 p-12 rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Collections coming soon...</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
