import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Steps from "@/components/Steps";
import About from "@/components/About"
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About/>
      <Features />
      <Steps />
      <Footer />
    </>
  );
}