import Image from "next/image";
import Header from './components/header'
import Hero from './components/hero'
import Mortality from './pages/mortality'
import Footer from './components/footer'
import HomeInfo from './components/homeInfo.tsx'

export default function Home() {
  return (
    <>
      <Header></Header>
      <main>
        <Hero></Hero>
        <HomeInfo></HomeInfo>
        <Mortality></Mortality>
      </main>
      <Footer></Footer>
    </>
  )
}
