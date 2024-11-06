import Image from "next/image";
import Header from './components/header'
import Hero from './components/hero'
import Mortality from './pages/mortality'
import Footer from './components/footer'

export default function Home() {
  return (
    <>
      <Header></Header>
      <main style={{ padding: '1rem' }}>
        <Hero></Hero>
        <Mortality></Mortality>
      </main>
      <Footer></Footer>
    </>
  )
}
