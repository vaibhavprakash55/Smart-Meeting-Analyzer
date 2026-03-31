import { useState, useEffect } from 'react';
import './LiveDemo.css';

const PARTS = [
  { i:'AS', c:'#c8f135', n:'Aryan' },
  { i:'PM', c:'#7b6cfa', n:'Priya' },
  { i:'RK', c:'#38e8c8', n:'Rahul' },
  { i:'DT', c:'#fa8b6c', n:'Divya' },
];
const LINES = [
  { s:'Aryan', c:'#c8f135', t:'Latency is 800ms — need it under 400.', pi:0 },
  { s:'Priya', c:'#7b6cfa', t:"I'll batch the Whisper calls, easy fix.", pi:1 },
  { s:'Rahul', c:'#38e8c8', t:'Can we move the demo to Friday?', pi:2 },
  { s:'Aryan', c:'#c8f135', t:"Friday works — let's lock it in.", pi:0 },
];
const SUM = [
  'Reduce latency: 800ms → 400ms',
  'Priya to batch Whisper API calls',
  'Demo rescheduled to Friday',
  'Divya updating calendar invites',
];

export default function LiveDemo() {
  const [lines, setLines]     = useState(0);
  const [sumIdx, setSumIdx]   = useState(-1);
  const [active, setActive]   = useState(0);

  useEffect(() => {
    if (lines < LINES.length) {
      const id = setTimeout(() => {
        setActive(LINES[lines].pi);
        setLines(l => l + 1);
      }, lines === 0 ? 800 : 2000);
      return () => clearTimeout(id);
    }
  }, [lines]);

  useEffect(() => {
    SUM.forEach((_, i) => {
      setTimeout(() => setSumIdx(i), i * 600 + 1000);
    });
  }, []);

  return (
    <div className="demo-card" id="live-demo">
      <div className="demo-bar">
        <div className="demo-dot" style={{background:'#e8534a'}} />
        <div className="demo-dot" style={{background:'#e8a534'}} />
        <div className="demo-dot" style={{background:'#c8f135'}} />
        <span className="demo-title">EchoBrief · Live Session</span>
        <div className="pill pill-r"><div className="rec-dot" />REC · 04:32</div>
        <span className="demo-info">3 speakers detected</span>
      </div>
      <div className="demo-body">

        {/* Participants */}
        <div className="demo-section">
          <div className="ds-title">Participants</div>
          <div className="participants">
            {PARTS.map((p, i) => (
              <div key={p.n} className={`participant ${active === i ? 'active' : ''}`} style={{'--ac': p.c}}>
                <div className="p-avatar" style={{background: p.c+'14', borderColor: p.c+'44', color: p.c}}>{p.i}</div>
                <div className="p-name">{p.n}</div>
                {active === i && (
                  <div className="p-bars">
                    {[0,1,2,3,4].map(j => (
                      <div key={j} className="p-bar" style={{background: p.c, animationDelay: `${j*0.1}s`}} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Transcript */}
        <div className="demo-section">
          <div className="ds-title">Live Transcript</div>
          <div className="tscript">
            {LINES.slice(0, lines).map((l, i) => (
              <div key={i} className="tl">
                <span className="tl-sp" style={{color: l.c}}>{l.s}</span>
                <span className="tl-tx">{l.t}</span>
              </div>
            ))}
            {lines < LINES.length && <div className="t-cur" />}
          </div>
        </div>

        {/* Summary */}
        <div className="demo-section">
          <div className="ds-title">AI Summary</div>
          <div className="sum-items">
            {SUM.map((item, i) => (
              <div key={i} className={`si ${i <= sumIdx ? 'on' : ''}`}>
                <div className="si-dot" />
                <div className="si-txt">{item}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
