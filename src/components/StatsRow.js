import './StatsRow.css';
const STATS = [
  { n: '98', s: '%', l: 'Transcription accuracy', t: '↑ +2% this month' },
  { n: '<30', s: 's', l: 'Processing time',       t: '↑ 3× faster' },
  { n: '12',  s: '+', l: 'Speaker support',       t: '↑ Up from 8' },
  { n: '5',   s: '×', l: 'Faster recap',          t: '↑ vs manual' },
];
export default function StatsRow() {
  return (
    <div className="stats-row">
      {STATS.map(s => (
        <div key={s.l} className="stat-card">
          <div className="stat-n">{s.n}<span>{s.s}</span></div>
          <div className="stat-l">{s.l}</div>
          <div className="stat-t">{s.t}</div>
        </div>
      ))}
    </div>
  );
}
