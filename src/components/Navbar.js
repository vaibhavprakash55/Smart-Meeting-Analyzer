import './Navbar.css';
export default function Navbar() {
  const s=(id)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  return (
    <nav className="nav">
      <div className="logo">
        <div className="logo-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#0b0b0f"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.06A9 9 0 0 0 21 10z"/></svg>
        </div>
        Echo<span>Brief</span>
      </div>
      <div className="nav-c">
        <a className="nav-link" onClick={()=>s('features')}>Features</a>
        <a className="nav-link" onClick={()=>s('live-demo')}>How It Works</a>
        <a className="nav-link" onClick={()=>s('stack')}>Tech Stack</a>
        <button className="btn-nav">Get Started</button>
      </div>
    </nav>
  );
}
