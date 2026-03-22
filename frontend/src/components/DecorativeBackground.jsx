import { useEffect, useState } from 'react';
import './DecorativeBackground.css';

export default function DecorativeBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="deco-bg">
      <div 
        className="deco-grid" 
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />
      <div className="deco-lines">
        <div className="deco-line deco-line--1" style={{ transform: `scaleY(${1 + scrollY * 0.001})` }} />
        <div className="deco-line deco-line--2" style={{ transform: `scaleY(${1 + scrollY * 0.0005})` }} />
      </div>
    </div>
  );
}
