import Masonry from 'react-masonry-css';
import './Photography.css';

const photos = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', alt: 'Mountain landscape' },
  { id: 2, url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&q=80', alt: 'Golden hour' },
  { id: 3, url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80', alt: 'City lights' },
  { id: 4, url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80', alt: 'Forest path' },
  { id: 5, url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=80', alt: 'Sunset sea' },
  { id: 6, url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80', alt: 'Travel' },
  { id: 7, url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', alt: 'Street' },
  { id: 8, url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80', alt: 'Architecture' },
  { id: 9, url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80', alt: 'Night city' },
];

const breakpoints = { default: 3, 1024: 2, 640: 1 };

export default function Photography() {
  return (
    <section className="photography section-padding" id="photography">
      <div className="container">
        <span className="section-eyebrow">Photography</span>
        <h2 className="section-title">Moments Through My Lens</h2>
        <p className="section-subtitle">
          Capturing life's fleeting moments — from golden hour landscapes to candid street scenes.
        </p>

        <Masonry
          breakpointCols={breakpoints}
          className="photography__masonry"
          columnClassName="photography__masonry-col"
        >
          {photos.map((photo) => (
            <div key={photo.id} className="photography__item">
              <img src={photo.url} alt={photo.alt} loading="lazy" />
              <div className="photography__overlay">
                <span>{photo.alt}</span>
              </div>
            </div>
          ))}
        </Masonry>
      </div>
    </section>
  );
}
