import './TechStack.css';
const TECH = [
  {l:'React.js',c:'#c8f135'},{l:'Flutter / React Native',c:'#7b6cfa'},
  {l:'Python FastAPI',c:'#38e8c8'},{l:'OpenAI Whisper',c:'#c8f135'},
  {l:'Pyannote.audio',c:'#7b6cfa'},{l:'GPT-4o',c:'#38e8c8'},
  {l:'LibriCSS Dataset',c:'#c8f135'},{l:'AMI Meeting Corpus',c:'#7b6cfa'},
];
export default function TechStack() {
  return (
    <div className="card" id="stack">
      <div className="section-label">Built With</div>
      <div className="section-title">State-of-the-art models under the hood.</div>
      <div className="tech-pills">
        {TECH.map(t => (
          <div key={t.l} className="tp">
            <div className="tp-d" style={{background:t.c}} />
            {t.l}
          </div>
        ))}
      </div>
    </div>
  );
}
