import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__bg-decoration">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
      </div>

      <div className="container hero__content">
        <div className="hero__text">
          <span className="hero__badge animate-fade-up">Available for freelance</span>
          <h1 className="hero__headline animate-fade-up delay-100">
            Hello, I'm
            <br />
            <span className="hero__name">Nithish Kumar M</span>
          </h1>
          <p className="hero__subtitle animate-fade-up delay-200">
            Graphic Designer · UI/UX Designer · Photographer <br />
          </p>
          <p className="hero__description animate-fade-up delay-300">
            Where creativity meets clarity — powered by design, prompt engineering, and technology.
          </p>
          <div className="hero__actions animate-fade-up delay-400">
            <Link to="/projects" className="btn btn-primary">
              View Projects <ArrowRight size={16} />
            </Link>
            <a href="#contact" className="btn btn-outline" onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Contact Me <Mail size={16} />
            </a>
          </div>
        </div>

        <div className="hero__visual animate-fade-in delay-300">
          <div className="hero__portrait">
            <img src="/profile.jpg" alt="Nithish Kumar M" className="hero__portrait-img" />
            <div className="hero__portrait-gradient" />
          </div>
          <div className="hero__stat hero__stat--1">
            <span className="hero__stat-num">5+</span>
            <span className="hero__stat-label">Projects</span>
          </div>
          <div className="hero__stat hero__stat--2">
            <span className="hero__stat-num">3+</span>
            <span className="hero__stat-label">Years Learning</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <div className="hero__scroll-indicator" />
        <span>Scroll down</span>
      </div>
    </section>
  );
}
