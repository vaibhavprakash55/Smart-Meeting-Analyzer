import './App.css';
import Navbar     from './components/Navbar';
import Sidebar    from './components/Sidebar';
import Hero       from './components/Hero';
import StatsRow   from './components/StatsRow';
import Features   from './components/Features';
import LiveDemo   from './components/LiveDemo';
import TechStack  from './components/TechStack';
import Footer     from './components/Footer';

export default function App() {
  return (
    <div className="app">
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />
      <Navbar />
      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, overflowX: 'hidden' }}>
          <Hero />
          <StatsRow />
          <Features />
          <LiveDemo />
          <TechStack />
        </main>
      </div>
      <Footer />
    </div>
  );
}
