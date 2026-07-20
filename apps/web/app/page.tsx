import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { HorariosContato } from "@/components/horarios-contato"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden w-full">
      <Header />
      <Hero />
      <Categories />
      <HorariosContato />
      <Footer />
    </main>
  )
}
