import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import About from '../components/About';
import Education from '../components/Education';
import Contact from '../components/Contact';
import ScrollReveal from '../components/ScrollReveal';
import DecorativeBackground from '../components/DecorativeBackground';

export default function Home() {
  return (
    <>
      <Navbar />
      <DecorativeBackground />
      <main>
        <ScrollReveal delay={100}>
          <Hero />
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <Experience />
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <Skills />
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <About />
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Education />
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <Contact />
        </ScrollReveal>
      </main>
    </>
  );
}
