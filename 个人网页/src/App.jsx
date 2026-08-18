import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Works from './components/Works';
import Strengths from './components/Strengths';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="site">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Works />
        <Strengths />
      </main>
      <Contact />
    </div>
  );
}

