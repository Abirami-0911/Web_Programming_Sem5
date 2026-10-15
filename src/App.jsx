import { useEffect, useMemo, useState } from "react";
import {
  Plus, Sparkles, Moon, Heart, LockKeyhole, Orbit, Flower2,
  Clock3, ArrowUpRight, Trash2, ImagePlus, WandSparkles, X,
  Stars, Send, ChevronRight, BookHeart, CalendarDays, MessageCircleHeart, CircleHelp, Sprout, CheckCircle2
} from "lucide-react";
import "./App.css";

const STORAGE_KEY = "dear-future-me-capsules-v1";
const DIARY_KEY = "dear-future-me-diary-v1";
const FUTURE_KEY = "dear-future-me-answers-v1";
const QUIZ_KEY = "dear-future-me-quiz-v1";
function readStored(key) { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } }
const dailyQuestions = [
  "What is one dream you hope comes true?",
  "What are you learning about yourself lately?",
  "What small thing made today beautiful?",
  "What would you like your future self to remember about this season?",
  "What are you brave enough to try next?",
  "What are you afraid of right now, and what would you tell yourself?",
  "What does your happiest future look like?"
];
const predictionQuestions = ["What will make me happiest next year?", "Which goal will I achieve first?", "Will I still love my current favourite song?", "What advice will future me give present me?"];
const moods = [
  { label: "Hopeful", emoji: "✨" },
  { label: "Happy", emoji: "☀️" },
  { label: "Lost", emoji: "🌧️" },
  { label: "Grateful", emoji: "🌷" },
  { label: "Dreaming", emoji: "🌙" },
  { label: "Brave", emoji: "🦋" },
];
const prompts = [
  "What is something you hope you never forget about this season of life?",
  "What are you scared of right now, and what would you tell yourself about it?",
  "Describe an ordinary day you secretly wish you could keep forever.",
  "What dream are you quietly working toward?",
  "Who makes life feel a little softer lately?",
  "What would make your future self proud of you?",
];

function getCapsules() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function daysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.max(0, Math.ceil((target - today) / 86400000));
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric"
  });
}

function App() {
  const [capsules, setCapsules] = useState(getCapsules);
  const [page, setPage] = useState("universe");
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [gardenFilter, setGardenFilter] = useState("All");
  const [diary, setDiary] = useState(() => readStored(DIARY_KEY));
  const [futureAnswers, setFutureAnswers] = useState(() => readStored(FUTURE_KEY));
  const [quizAnswers, setQuizAnswers] = useState(() => readStored(QUIZ_KEY));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capsules));
  }, [capsules]);
  useEffect(() => { localStorage.setItem(DIARY_KEY, JSON.stringify(diary)); }, [diary]);
  useEffect(() => { localStorage.setItem(FUTURE_KEY, JSON.stringify(futureAnswers)); }, [futureAnswers]);
  useEffect(() => { localStorage.setItem(QUIZ_KEY, JSON.stringify(quizAnswers)); }, [quizAnswers]);

  const openedCount = capsules.filter(c => daysUntil(c.openDate) === 0).length;
  const moodsCount = new Set(capsules.map(c => c.mood)).size;

  function saveCapsule(capsule) {
    setCapsules(current => [capsule, ...current]);
    setShowCreate(false);
    setPage("universe");
  }

  function deleteCapsule(id) {
    setCapsules(current => current.filter(c => c.id !== id));
    setSelected(null);
  }

  function navigate(nextPage) {
    setSelected(null);
    setPage(nextPage);
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <button className="brand" onClick={() => navigate("universe")} aria-label="Go home">
          <span className="brand-mark"><Orbit size={19} /></span>
          <span>dear future me<span className="brand-dot">.</span></span>
        </button>
        <nav className="nav-links">
          <button className={page === "universe" ? "nav-link active" : "nav-link"} onClick={() => navigate("universe")}>My universe</button>
          <button className={page === "garden" ? "nav-link active" : "nav-link"} onClick={() => navigate("garden")}>Memory garden</button>
          <button className={page === "diary" ? "nav-link active" : "nav-link"} onClick={() => navigate("diary")}>Daily diary</button>
          <button className={page === "future" ? "nav-link active" : "nav-link"} onClick={() => navigate("future")}>Future me</button>
        </nav>
        <button className="top-create" onClick={() => setShowCreate(true)}><Plus size={16} /> New capsule</button>
      </header>

      <main className="main-content">
        {page === "universe" && (
          <>
            <section className="hero">
              <div className="eyebrow"><Sparkles size={14} /> A LITTLE UNIVERSE, JUST FOR YOU</div>
              <h1>Somewhere between<br />who you are <em>& who you’ll be.</em></h1>
              <p className="hero-copy">Leave little pieces of yourself among the stars.<br className="desktop-break" /> One day, your future self will find them.</p>
              <button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={17} /> Create your first capsule <ChevronRight size={17} /></button>
            </section>

            <section className="universe-panel">
              <div className="panel-top">
                <div><span className="section-kicker">YOUR PERSONAL GALAXY</span><h2>Memory constellation</h2></div>
                <div className="live-indicator"><span /> {capsules.length} {capsules.length === 1 ? "memory" : "memories"} orbiting</div>
              </div>
              <div className="galaxy">
                <div className="galaxy-glow" />
                <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" />
                <div className="central-planet"><Moon size={30} strokeWidth={1.2} /><span>you</span></div>
                {capsules.length === 0 ? (
                  <>
                    <button className="star-node star-demo node-a" onClick={() => setShowCreate(true)} aria-label="Create a memory"><span>✦</span></button>
                    <button className="star-node star-demo node-b" onClick={() => setShowCreate(true)} aria-label="Create a memory"><span>✧</span></button>
                    <button className="star-node star-demo node-c" onClick={() => setShowCreate(true)} aria-label="Create a memory"><span>✦</span></button>
                    <button className="star-node star-demo node-d" onClick={() => setShowCreate(true)} aria-label="Create a memory"><span>✧</span></button>
                    <div className="galaxy-empty"><Stars size={18} /><strong>Your story starts here</strong><span>Every capsule you create becomes a star.</span></div>
                  </>
                ) : capsules.map((capsule, index) => {
                  const positions = ["node-a", "node-b", "node-c", "node-d", "node-e", "node-f", "node-g", "node-h"];
                  return <button key={capsule.id} className={`star-node ${positions[index % positions.length]}`} onClick={() => setSelected(capsule)} title={capsule.title}><span>{capsule.moodEmoji || "✦"}</span><small>{capsule.title}</small></button>;
                })}
                <div className="galaxy-caption"><span className="tiny-star">✦</span> YOUR MEMORIES, IN ORBIT <span className="tiny-star">✦</span></div>
              </div>
              <div className="galaxy-legend"><span><i className="legend-dot lilac" /> Sealed capsule</span><span><i className="legend-dot gold" /> Ready to open</span><span><i className="legend-dot pink" /> A feeling you saved</span></div>
            </section>

            <section className="stats-row">
              <div className="stat-card"><div className="stat-icon purple"><LockKeyhole size={18} /></div><div><strong>{capsules.length}</strong><span>Time capsules</span></div></div>
              <div className="stat-card"><div className="stat-icon peach"><Clock3 size={18} /></div><div><strong>{capsules.filter(c => daysUntil(c.openDate) > 0).length}</strong><span>Waiting for future you</span></div></div>
              <div className="stat-card"><div className="stat-icon pink"><Heart size={18} /></div><div><strong>{moodsCount}</strong><span>Moods collected</span></div></div>
            </section>
            <section className="bottom-note"><span className="note-sparkle">✧</span><p>“You are allowed to become someone you haven’t even imagined yet.”</p><span>— a note from the universe</span></section>
          </>
        )}

        {page === "garden" && (
          <section className="inner-page">
            <div className="eyebrow"><Flower2 size={14} /> THE LITTLE THINGS MATTER</div>
            <h1>Your memory <em>garden.</em></h1>
            <p className="hero-copy">Every feeling is a flower. Every memory deserves a place to grow.</p>
            <div className="filter-row">{["All", ...moods.map(m => m.label)].map(m => <button key={m} className={gardenFilter === m ? "filter-chip selected" : "filter-chip"} onClick={() => setGardenFilter(m)}>{m}</button>)}</div>
            {capsules.filter(c => gardenFilter === "All" || c.mood === gardenFilter).length === 0 ? (
              <div className="empty-state"><Flower2 size={34} /><h3>Plant your first memory</h3><p>Create a capsule and it will bloom here.</p><button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={16} /> Add a memory</button></div>
            ) : <div className="memory-grid">{capsules.filter(c => gardenFilter === "All" || c.mood === gardenFilter).map(c => <MemoryCard key={c.id} capsule={c} onClick={() => setSelected(c)} />)}</div>}
            {diary.filter(d => gardenFilter === "All" || d.mood === gardenFilter).length > 0 && <div className="garden-blooms"><div className="panel-top"><div><span className="section-kicker">LITTLE DAILY BLOOMS</span><h2>Your diary flowers</h2></div></div><div className="memory-grid">{diary.filter(d => gardenFilter === "All" || d.mood === gardenFilter).map(d => <article className="memory-card diary-bloom" key={d.id}>{d.photo ? <img className="memory-photo" src={d.photo} alt="Diary memory"/> : <div className="memory-photo placeholder-photo bloom-photo"><span>{d.emoji || "🌷"}</span></div>}<div className="memory-card-content"><div className="memory-meta"><span>{d.emoji} {d.mood}</span><span>{formatDate(d.date)}</span></div><h3>{d.good ? "A little good thing" : d.grateful ? "A grateful moment" : "A day I kept"}</h3><p>{d.good || d.grateful || d.learned || "A memory from your daily diary."}</p>{d.hard && <span className="card-date">And I made space for the hard things, too.</span>}</div></article>)}</div></div>}
          </section>
        )}

        {page === "diary" && <DiaryPage diary={diary} setDiary={setDiary} />}
        {page === "future" && <FuturePage futureAnswers={futureAnswers} setFutureAnswers={setFutureAnswers} quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers} />}
        {page === "timeline" && <TimelinePage capsules={capsules} diary={diary} futureAnswers={futureAnswers} />}
      </main>

      <footer className="footer"><span>made of stardust & small beginnings</span><span>✦</span><button className="footer-link" onClick={() => navigate("timeline")}>My life timeline</button><span>your story is still unfolding</span></footer>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onSave={saveCapsule} />}
      {selected && <CapsuleModal capsule={selected} onClose={() => setSelected(null)} onDelete={deleteCapsule} />}
    </div>
  );
}

function MemoryCard({ capsule, onClick }) {
  const days = daysUntil(capsule.openDate);
  const locked = days > 0;
  return <button className={`memory-card ${locked ? "memory-card-locked" : ""}`} onClick={onClick}>
    {locked ? <div className="memory-photo sealed-photo"><div className="sealed-envelope">💌</div><span>SEALED WITH LOVE</span></div> : capsule.photo ? <img className="memory-photo" src={capsule.photo} alt="Memory attachment" /> : <div className="memory-photo placeholder-photo"><span>{capsule.moodEmoji || "✧"}</span></div>}
    <div className="memory-card-content"><div className="memory-meta"><span>{capsule.moodEmoji} {capsule.mood}</span><span>{locked ? `${days} days left` : "Ready to open"}</span></div><h3>{capsule.title}</h3>{locked ? <p className="secret-copy"><LockKeyhole size={13} /> Your words are tucked safely inside. Open on your special day.</p> : <p>{capsule.message}</p>}<span className="card-date">{locked ? "Unlocks" : "Opened from"} {formatDate(capsule.openDate)} <ArrowUpRight size={13} /></span></div>
  </button>;
}

function CreateModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState(moods[0]);
  const [openDate, setOpenDate] = useState("");
  const [photo, setPhoto] = useState("");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError("Please choose a photo smaller than 1 MB so your memory can be saved in this browser.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
    setError("");
  }

  function submit(event) {
    event.preventDefault();
    if (!title.trim() || !message.trim() || !openDate) {
      setError("Add a title, your letter, and an opening date.");
      return;
    }
    onSave({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: title.trim(), message: message.trim(), mood: mood.label,
      moodEmoji: mood.emoji, openDate, photo, createdAt: new Date().toISOString(),
      reflection: ""
    });
  }

  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="modal create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
      <div className="modal-header"><div><span className="section-kicker">A MESSAGE THROUGH TIME</span><h2 id="create-title">Write to future you</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div>
      <p className="modal-intro">Take a breath. Write something your future self might need to hear.</p>
      <form onSubmit={submit}>
        <label className="field-label">Give this memory a name<input value={title} onChange={e => setTitle(e.target.value)} maxLength={60} placeholder="e.g. The year I learned to be brave" /></label>
        <div className="field-label">What season of life are you in?</div>
        <div className="mood-picker">{moods.map(m => <button type="button" key={m.label} className={mood.label === m.label ? "mood-option chosen" : "mood-option"} onClick={() => setMood(m)}><span>{m.emoji}</span>{m.label}</button>)}</div>
        <label className="field-label">Your letter<textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} maxLength={4000} placeholder="Dear future me, right now I'm..." /></label>
        <button className="prompt-link" type="button" onClick={() => { const p = prompts[Math.floor(Math.random() * prompts.length)]; setPrompt(p); setMessage(old => old ? `${old}\n\n${p}\n` : `${p}\n`); }}><WandSparkles size={14} /> {prompt ? "Try another writing prompt" : "I'm stuck — give me a prompt"}</button>
        {prompt && <p className="prompt-preview">“{prompt}”</p>}
        <label className="field-label">Attach a little memory <span className="optional">(optional · max 1 MB)</span><span className="upload-control"><ImagePlus size={18} /><span>{photo ? "Photo added — choose another" : "Choose a photo"}</span><input type="file" accept="image/*" onChange={handlePhoto} /></span></label>
        {photo && <img className="photo-preview" src={photo} alt="Your selected memory" />}
        <label className="field-label">When should this letter open?<input type="date" min={minDate} value={openDate} onChange={e => setOpenDate(e.target.value)} /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full-button" type="submit"><LockKeyhole size={16} /> Seal this time capsule <ChevronRight size={17} /></button>
        <p className="privacy-note"><LockKeyhole size={12} /> Saved in this browser only. It won't sync to other devices.</p>
      </form>
    </section>
  </div>;
}

function CapsuleModal({ capsule, onClose, onDelete }) {
  const [reflection, setReflection] = useState(capsule.reflection || "");
  const [saved, setSaved] = useState(false);
  const ready = daysUntil(capsule.openDate) === 0;
  const remaining = daysUntil(capsule.openDate);

  function saveReflection() {
    const all = getCapsules().map(c => c.id === capsule.id ? { ...c, reflection } : c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    capsule.reflection = reflection;
    setSaved(true);
  }

  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="modal capsule-modal" role="dialog" aria-modal="true" aria-labelledby="capsule-title">
      <div className="modal-header"><span className="capsule-symbol">{capsule.moodEmoji || "✦"}</span><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div>
      <div className="capsule-modal-body">
        <span className="section-kicker">{ready ? "THE MOMENT HAS ARRIVED" : "A MESSAGE SEALED IN TIME"}</span>
        <h2 id="capsule-title">{capsule.title}</h2>
        <div className="capsule-details">{capsule.moodEmoji} {capsule.mood} <span>·</span> Written {new Date(capsule.createdAt).toLocaleDateString()}</div>
        {!ready ? <div className="locked-message"><LockKeyhole size={24} /><strong>This memory is still travelling through time.</strong><span>{remaining === 1 ? "One more day" : `${remaining} days`} until you can open it.</span><div className="countdown-number">{remaining}<small>days to go</small></div></div> :
          <>
            <div className="opened-letter">{capsule.photo && <img src={capsule.photo} alt="Saved memory" />}<p>{capsule.message}</p></div>
            <div className="reflection-box"><label className="field-label">A note from present you</label><p className="reflection-hint">What has changed? What would you tell the person who wrote this?</p><textarea value={reflection} onChange={e => { setReflection(e.target.value); setSaved(false); }} rows={4} placeholder="Dear past me..." /><button className="secondary-button" onClick={saveReflection}><Heart size={15} /> {saved ? "Reflection saved" : "Save reflection"}</button></div>
          </>
        }
        <button className="delete-link" onClick={() => { if (window.confirm("Delete this time capsule permanently?")) onDelete(capsule.id); }}><Trash2 size={13} /> Delete this capsule</button>
      </div>
    </section>
  </div>;
}


function DiaryPage({ diary, setDiary }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [good, setGood] = useState(""); const [hard, setHard] = useState("");
  const [learned, setLearned] = useState(""); const [grateful, setGrateful] = useState("");
  const [mood, setMood] = useState(moods[3]); const [photo, setPhoto] = useState(""); const [notice, setNotice] = useState("");
  const existing = diary.find(entry => entry.date === date);
  function loadDate(next) { setDate(next); const item = diary.find(entry => entry.date === next); setGood(item?.good || ""); setHard(item?.hard || ""); setLearned(item?.learned || ""); setGrateful(item?.grateful || ""); setMood(moods.find(m => m.label === item?.mood) || moods[3]); setPhoto(item?.photo || ""); setNotice(""); }
  function handlePhoto(e) { const file = e.target.files?.[0]; if (!file) return; if (file.size > 450 * 1024) { setNotice("Choose a photo under 450 KB to keep local storage healthy."); return; } const reader = new FileReader(); reader.onload = () => setPhoto(String(reader.result)); reader.readAsDataURL(file); }
  function save(e) { e.preventDefault(); const entry = { id: existing?.id || String(Date.now()), date, good, hard, learned, grateful, mood: mood.label, emoji: mood.emoji, photo }; setDiary(old => [entry, ...old.filter(item => item.date !== date)].sort((a,b) => b.date.localeCompare(a.date))); setNotice("Your day has been tucked into your diary 💗"); }
  return <section className="inner-page"><div className="eyebrow"><BookHeart size={14}/> A SOFT PLACE TO LAND</div><h1>Your daily <em>diary.</em></h1><p className="hero-copy">The good, the hard, and everything in between. This day belongs to you.</p>
    <form className="journal-panel" onSubmit={save}><div className="journal-heading"><div><span className="section-kicker">A PAGE FOR TODAY</span><h2>{existing ? "Revisit this day" : "How was your day?"}</h2></div><label className="date-label"><CalendarDays size={15}/><input type="date" value={date} max={today} onChange={e => loadDate(e.target.value)}/></label></div>
      <label className="field-label">☀️ Good news & happy moments<textarea rows="3" value={good} onChange={e => setGood(e.target.value)} placeholder="What went right today, even if it was tiny?" /></label>
      <label className="field-label">🌧️ Hard news, worries or challenges<textarea rows="3" value={hard} onChange={e => setHard(e.target.value)} placeholder="You can put the heavy things down here." /></label>
      <div className="journal-two"><label className="field-label">🌱 Something I learned<textarea rows="2" value={learned} onChange={e => setLearned(e.target.value)} placeholder="A lesson, a thought..." /></label><label className="field-label">💗 Today I'm grateful for<textarea rows="2" value={grateful} onChange={e => setGrateful(e.target.value)} placeholder="One little thing I appreciate" /></label></div>
      <div className="field-label">What feeling visited you today?</div><div className="mood-picker">{moods.map(m => <button type="button" key={m.label} className={mood.label === m.label ? "mood-option chosen" : "mood-option"} onClick={() => setMood(m)}><span>{m.emoji}</span>{m.label}</button>)}</div>
      <label className="field-label">Add a photo from today <span className="optional">(optional · under 450 KB)</span><span className="upload-control"><ImagePlus size={18}/><span>{photo ? "Photo attached · choose another" : "Choose a photo"}</span><input type="file" accept="image/*" onChange={handlePhoto}/></span></label>{photo && <img className="photo-preview" src={photo} alt="Diary memory"/>}
      {notice && <p className="form-notice">{notice}</p>}<button className="primary-button full-button" type="submit"><Heart size={16}/>{existing ? "Update this diary page" : "Save today's memories"}<ChevronRight size={16}/></button>
    </form>
    <div className="journal-entries"><div className="panel-top"><div><span className="section-kicker">LITTLE MOMENTS, KEPT</span><h2>Diary pages</h2></div><span className="entry-count">{diary.length} {diary.length === 1 ? "day" : "days"} saved</span></div>
      {diary.length === 0 ? <div className="empty-state"><Sprout size={30}/><h3>Your first page is waiting</h3><p>Save a little piece of today. There is no perfect way to write a diary.</p></div> : <div className="diary-entry-list">{diary.map(entry => <article className="diary-entry" key={entry.id}><div className="diary-entry-date"><span>{entry.emoji}</span><strong>{new Date(`${entry.date}T00:00:00`).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</strong><small>{entry.mood}</small><button className="text-button" onClick={() => loadDate(entry.date)}>Edit</button></div><div className="diary-entry-body">{entry.photo && <img src={entry.photo} alt="Saved day"/>}{entry.good && <p><strong>Good:</strong> {entry.good}</p>}{entry.hard && <p><strong>Hard:</strong> {entry.hard}</p>}{entry.learned && <p><strong>Learned:</strong> {entry.learned}</p>}{entry.grateful && <p><strong>Grateful for:</strong> {entry.grateful}</p>}</div></article>)}</div>}
    </div>
  </section>;
}

function FuturePage({ futureAnswers, setFutureAnswers, quizAnswers, setQuizAnswers }) {
  const [answer, setAnswer] = useState(""); const [revisit, setRevisit] = useState("30");
  const [prediction, setPrediction] = useState({}); const [quizRevisit, setQuizRevisit] = useState("365"); const [notice, setNotice] = useState("");
  const dayIndex = Math.floor(Date.now() / 86400000) % dailyQuestions.length; const question = dailyQuestions[dayIndex];
  const existing = futureAnswers.find(a => a.question === question && a.createdAt.slice(0,10) === new Date().toISOString().slice(0,10));
  function saveAnswer(e) { e.preventDefault(); if (!answer.trim()) return; const created = new Date(); const unlock = new Date(created); unlock.setDate(unlock.getDate() + Number(revisit)); setFutureAnswers(old => [{id:String(Date.now()),question,answer:answer.trim(),createdAt:created.toISOString(),unlockDate:unlock.toISOString().slice(0,10)},...old]); setAnswer(""); setNotice("Your answer is sealed for future you 💌"); }
  function saveQuiz(e) { e.preventDefault(); const completed = predictionQuestions.map((q,i) => ({question:q,answer:(prediction[i]||"").trim()})).filter(q => q.answer); if (!completed.length) { setNotice("Write at least one prediction before sealing it."); return; } const now = new Date(); const unlock = new Date(now); unlock.setDate(unlock.getDate()+Number(quizRevisit)); setQuizAnswers(old => [{id:String(Date.now()),answers:completed,createdAt:now.toISOString(),unlockDate:unlock.toISOString().slice(0,10)},...old]); setPrediction({}); setNotice("Your future predictions are sealed. Come back to compare them!"); }
  const isUnlocked = date => daysUntil(date) === 0;
  return <section className="inner-page"><div className="eyebrow"><MessageCircleHeart size={14}/> A CONVERSATION ACROSS TIME</div><h1>Dear future <em>me.</em></h1><p className="hero-copy">Ask yourself a question today. Leave an answer for the person you're becoming.</p>
    {notice && <p className="form-notice notice-center">{notice}</p>}
    <div className="future-grid"><form className="journal-panel future-panel" onSubmit={saveAnswer}><div className="future-icon">💌</div><span className="section-kicker">TODAY'S QUESTION</span><h2>{question}</h2><p className="reflection-hint">There are no right answers. Just your truth, right now.</p><textarea className="future-answer" rows="5" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Dear future me, I hope you remember..."/><label className="field-label">Let me read this answer in<select value={revisit} onChange={e => setRevisit(e.target.value)}><option value="30">One month</option><option value="90">Three months</option><option value="180">Six months</option><option value="365">One year</option></select></label><button className="primary-button full-button" type="submit"><LockKeyhole size={15}/> Seal my answer</button></form>
      <form className="journal-panel future-panel quiz-panel" onSubmit={saveQuiz}><div className="future-icon">🔮</div><span className="section-kicker">A LITTLE FUTURE SELF QUIZ</span><h2>Make a few predictions</h2><p className="reflection-hint">Guess what life might look like when you open this again.</p>{predictionQuestions.map((q,i)=><label className="field-label quiz-question" key={q}>{i+1}. {q}<textarea rows="2" value={prediction[i]||""} onChange={e=>setPrediction(old=>({...old,[i]:e.target.value}))} placeholder="My prediction is..."/></label>)}<label className="field-label">Compare my predictions in<select value={quizRevisit} onChange={e=>setQuizRevisit(e.target.value)}><option value="30">One month</option><option value="90">Three months</option><option value="180">Six months</option><option value="365">One year</option></select></label><button className="primary-button full-button" type="submit"><Stars size={15}/> Seal my predictions</button></form></div>
    <div className="journal-entries"><div className="panel-top"><div><span className="section-kicker">LETTERS TO YOURSELF</span><h2>Answers waiting in time</h2></div></div>{futureAnswers.length===0 && quizAnswers.length===0 ? <div className="empty-state"><Moon size={30}/><h3>Your future conversation begins here</h3><p>Save an answer or prediction and return when its date arrives.</p></div> : <div className="waiting-list">{futureAnswers.map(item=><article className="waiting-card" key={item.id}><div className="waiting-icon">{isUnlocked(item.unlockDate)?"💗":"💌"}</div><div className="waiting-content"><span className="section-kicker">{isUnlocked(item.unlockDate)?"READY TO REVISIT":"SEALED ANSWER"}</span><h3>{item.question}</h3><p>{isUnlocked(item.unlockDate)?item.answer:"Your answer is hidden until " + formatDate(item.unlockDate) + "."}</p>{isUnlocked(item.unlockDate)&&<label className="field-label">What would you tell your past self now?<textarea rows="2" placeholder="Write your reflection here..." onBlur={e=>{if(e.target.value.trim())setFutureAnswers(old=>old.map(a=>a.id===item.id?{...a,reflection:e.target.value}:a));}} defaultValue={item.reflection||""}/></label>}</div></article>)}{quizAnswers.map(item=><article className="waiting-card" key={item.id}><div className="waiting-icon">🔮</div><div className="waiting-content"><span className="section-kicker">{isUnlocked(item.unlockDate)?"PREDICTIONS UNLOCKED":"PREDICTIONS SEALED"}</span><h3>My future predictions</h3><p>{isUnlocked(item.unlockDate)?`Written ${formatDate(item.createdAt.slice(0,10))} · Ready to compare your predictions with real life.`:`Your predictions are hidden until ${formatDate(item.unlockDate)}.`}</p>{isUnlocked(item.unlockDate)&&item.answers.map(a=><div className="prediction-result" key={a.question}><strong>{a.question}</strong><p>{a.answer}</p><label className="field-label">What actually happened?<textarea rows="2" placeholder="Compare with real life..." onBlur={e=>{if(e.target.value.trim())setQuizAnswers(old=>old.map(qz=>qz.id===item.id?{...qz,answers:qz.answers.map(x=>x.question===a.question?{...x,actual:e.target.value}:x)}:qz));}} defaultValue={a.actual||""}/></label></div>)}</div></article>)}</div>}</div>
  </section>;
}

function TimelinePage({ capsules, diary, futureAnswers }) {
  const items = [...capsules.map(c=>({id:c.id,date:c.createdAt.slice(0,10),type:"Time capsule",title:c.title,detail:daysUntil(c.openDate)===0?"Ready to open":`Sealed until ${formatDate(c.openDate)}`,emoji:c.moodEmoji||"💌"})),...diary.map(d=>({id:d.id,date:d.date,type:"Daily diary",title:d.good||d.grateful||"A day in my life",detail:`Mood: ${d.mood}`,emoji:d.emoji||"🌷"})),...futureAnswers.map(a=>({id:a.id,date:a.createdAt.slice(0,10),type:"Future self",title:a.question,detail:`Revisit ${formatDate(a.unlockDate)}`,emoji:"✨"}))].sort((a,b)=>b.date.localeCompare(a.date));
  return <section className="inner-page"><div className="eyebrow"><CalendarDays size={14}/> YOUR STORY, OVER TIME</div><h1>My life <em>timeline.</em></h1><p className="hero-copy">Little proof that you're growing, changing, and becoming.</p>{items.length===0?<div className="empty-state"><Stars size={32}/><h3>Your story is still unfolding</h3><p>Your saved letters, diary pages and future-self answers will appear here.</p></div>:<div className="timeline-list">{items.map(item=><article className="timeline-item" key={`${item.type}-${item.id}`}><div className="timeline-dot">{item.emoji}</div><div className="timeline-copy"><span className="section-kicker">{item.type} · {formatDate(item.date)}</span><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}</div>}</section>;
}

export default App;
