import './Footer.css';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="f-logo">Echo<span>Brief</span></div>
      <div className="f-links">
        {['Features','How It Works','Tech Stack','About'].map(l=>(
          <div key={l} className="f-link">{l}</div>
        ))}
      </div>
      <div className="f-credit">GLA University, Mathura · B.Tech CSE · 2025–26</div>
    </footer>
  );
}
