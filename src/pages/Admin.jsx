import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { md } from '../utils';
import './Admin.css';

const PAGES = [
  { id:'dash',l:'Dashboard',s:'Overview' },
  { id:'hero',l:'Hero',s:'Content' },{ id:'about',l:'About',s:'Content' },{ id:'skills',l:'Skills',s:'Content' },
  { id:'exp',l:'Experience',s:'Content' },{ id:'certs',l:'Certifications',s:'Content' },{ id:'edu',l:'Education',s:'Content' },
  { id:'proj',l:'Projects',s:'Content' },{ id:'contact',l:'Contact',s:'Content' },
  { id:'blogs',l:'Blog Posts',s:'Blog' },
];

export default function Admin({ data, onSave, onLogout }) {
  const [pg, setPg] = useState('dash');
  const [sb, setSb] = useState(false);
  const nav = useNavigate();
  let ls = '';

  return (
    <div className="adm">
      <div className="adm-mob"><button className="ab ag as" onClick={() => setSb(!sb)}>☰</button><span className="adm-mob-t">◆ admin</span></div>
      <aside className={`adm-sb ${sb ? 'open' : ''}`}>
        <div className="sb-brand">◆ olana<span>.admin</span></div>
        {PAGES.map(p => { const sh = p.s !== ls; ls = p.s; return <div key={p.id}>{sh && <div className="sb-sec">{p.s}</div>}<button className={`sb-link ${pg===p.id?'active':''}`} onClick={() => { setPg(p.id); setSb(false); }}>{p.l}</button></div>; })}
        <div className="sb-ft">
          <button className="ab ag as aw" onClick={() => nav('/')}>◉ View Site</button>
          <button className="ab ad as aw" onClick={onLogout}>Logout</button>
        </div>
      </aside>
      <main className="adm-main">
        {pg === 'dash' && <Dash data={data} go={setPg} />}
        {pg === 'hero' && <HeroEd data={data} save={onSave} />}
        {pg === 'about' && <AboutEd data={data} save={onSave} />}
        {pg === 'skills' && <SkillsEd data={data} save={onSave} />}
        {pg === 'exp' && <ListEd data={data} save={onSave} k="experience" t="Experience" fields={[{k:'role',l:'Role'},{k:'company',l:'Company'},{k:'location',l:'Location'},{k:'date',l:'Date Range'},{k:'items',l:'Bullets (one per line)',type:'list'}]} empty={{date:'',role:'',company:'',location:'',items:[]}} />}
        {pg === 'certs' && <ListEd data={data} save={onSave} k="certifications" t="Certifications" fields={[{k:'name',l:'Name'},{k:'issuer',l:'Issuer'},{k:'year',l:'Year'},{k:'badge',l:'Badge'}]} empty={{year:'2026',name:'',issuer:'',badge:''}} />}
        {pg === 'edu' && <ListEd data={data} save={onSave} k="education" t="Education" fields={[{k:'degree',l:'Degree'},{k:'school',l:'School'},{k:'meta',l:'Location & Dates'},{k:'status',l:'Status'}]} empty={{degree:'',school:'',meta:'',status:''}} />}
        {pg === 'proj' && <ListEd data={data} save={onSave} k="projects" t="Projects" fields={[{k:'title',l:'Title'},{k:'icon',l:'Icon (emoji)'},{k:'desc',l:'Description',type:'ta'},{k:'tech',l:'Tech (comma-sep)',type:'tags'},{k:'link',l:'GitHub Link'}]} empty={{icon:'🔧',title:'',desc:'',tech:[],link:''}} />}
        {pg === 'contact' && <ContactEd data={data} save={onSave} />}
        {pg === 'blogs' && <BlogsEd data={data} save={onSave} />}
      </main>
      {sb && <div className="adm-ov" onClick={() => setSb(false)} />}
    </div>
  );
}

// ===== DASHBOARD =====
function Dash({ data, go }) {
  const pub = data.blogs.filter(b => b.published).length;

  const exportData = () => {
    const json = JSON.stringify(data, null, 2);
    const content = `export const DATA = ${json};\n`;
    const blob = new Blob([content], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    if (window.confirm('Reset all data to defaults? This clears all your edits.')) {
      localStorage.removeItem('olana-portfolio-data');
      window.location.reload();
    }
  };

  return <div>
    <div className="ah"><h1>Dashboard</h1><p>Overview of your portfolio</p></div>
    <div className="asg">{[
      { n: data.skills.reduce((a, s) => a + s.items.length, 0), l: 'Skills' },
      { n: data.experience.length, l: 'Positions' },
      { n: data.certifications.length, l: 'Certs' },
      { n: `${pub}/${data.blogs.length}`, l: 'Published' }
    ].map((s, i) => <div key={i} className="asb"><div className="asb-n">{s.n}</div><div className="asb-l">{s.l}</div></div>)}</div>

    <div className="ah"><h1>Quick Actions</h1></div>
    <div className="abr">
      <button className="ab aa" onClick={() => go('blogs')}>+ New Blog Post</button>
      <button className="ab ag" onClick={() => go('proj')}>+ Add Project</button>
      <button className="ab ag" onClick={() => go('certs')}>+ Add Cert</button>
    </div>

    <div className="ah" style={{ marginTop: 32 }}><h1>Deploy</h1><p>Export your data to update the live site</p></div>
    <div className="export-box">
      <div className="export-steps">
        <div className="export-step"><span className="export-num">1</span><span>Edit your content using the admin panel</span></div>
        <div className="export-step"><span className="export-num">2</span><span>Click <strong>Export data.js</strong> below — it downloads instantly</span></div>
        <div className="export-step"><span className="export-num">3</span><span>Replace <code>src/data.js</code> in your project with the downloaded file</span></div>
        <div className="export-step"><span className="export-num">4</span><span>Commit & push — GitHub Actions auto-deploys</span></div>
      </div>
      <div className="abr" style={{ marginTop: 16 }}>
        <button className="ab aa" onClick={exportData}>⬇ Export data.js</button>
        <button className="ab ad" onClick={resetData}>↺ Reset to Defaults</button>
      </div>
    </div>
  </div>;
}

// ===== FIELD =====
function F({ l, v, onChange, ta, tall }) {
  return <div className="afg"><label className="al">{l}</label>{ta ? <textarea className={`at ${tall?'att':''}`} value={v} onChange={e => onChange(e.target.value)} /> : <input className="ai" value={v} onChange={e => onChange(e.target.value)} />}</div>;
}

// ===== HERO =====
function HeroEd({ data, save }) {
  const [h, sH] = useState({ ...data.hero });
  const [ti, sTi] = useState('');
  const u = (k, v) => sH({ ...h, [k]: v });
  return <div>
    <div className="ah"><h1>Hero Section</h1></div>
    <F l="Name" v={h.name} onChange={v => u('name', v)} />
    <F l="Tagline" v={h.tagline} onChange={v => u('tagline', v)} ta />
    <F l="GitHub URL" v={h.githubUrl} onChange={v => u('githubUrl', v)} />
    <F l="Status" v={h.statusText} onChange={v => u('statusText', v)} />
    <F l="Location" v={h.locationText} onChange={v => u('locationText', v)} />
    <div className="afg"><label className="al">Tags</label>
      <div className="atags">{h.tags.map((t, i) => <span key={i} className="achip">{t}<span className="achipx" onClick={() => u('tags', h.tags.filter((_, j) => j !== i))}>×</span></span>)}</div>
      <div className="atr"><input className="ai" placeholder="Add tag..." value={ti} onChange={e => sTi(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && ti.trim()) { u('tags', [...h.tags, ti.trim()]); sTi(''); } }} /><button className="ab ag as" onClick={() => { if (ti.trim()) { u('tags', [...h.tags, ti.trim()]); sTi(''); } }}>Add</button></div>
    </div>
    <button className="ab aa" onClick={() => save({ ...data, hero: h })}>💾 Save</button>
  </div>;
}

// ===== ABOUT =====
function AboutEd({ data, save }) {
  const bio = Array.isArray(data.about.bio) ? data.about.bio : (data.about.bio || '').split('\n\n');
  const infos = data.about.infos || [];
  const stats = data.about.stats || [];
  const [a, sA] = useState({ ...data.about, bio: [...bio], stats: stats.map(s => ({ ...s })), infos: infos.map(i => ({ ...i })) });
  return <div>
    <div className="ah"><h1>About</h1></div>
    <F l="Bio Paragraphs (one per line)" v={a.bio.join('\n')} onChange={v => sA({ ...a, bio: v.split('\n') })} ta tall />
    <label className="al">Stats</label>
    {a.stats.map((s, i) => <div key={i} className="air"><input className="ai" style={{ width: 80 }} value={s.number} onChange={e => { const n = [...a.stats]; n[i] = { ...n[i], number: e.target.value }; sA({ ...a, stats: n }); }} /><input className="ai" value={s.label} onChange={e => { const n = [...a.stats]; n[i] = { ...n[i], label: e.target.value }; sA({ ...a, stats: n }); }} /><button className="ab ad as" onClick={() => sA({ ...a, stats: a.stats.filter((_, j) => j !== i) })}>✕</button></div>)}
    <button className="ab ag as" style={{ marginBottom: 16 }} onClick={() => sA({ ...a, stats: [...a.stats, { number: '0', label: 'New' }] })}>+ Stat</button><br/>
    <button className="ab aa" onClick={() => save({ ...data, about: a })}>💾 Save</button>
  </div>;
}

// ===== SKILLS =====
function SkillsEd({ data, save }) {
  const [sk, sSk] = useState(data.skills.map(s => ({ ...s, items: [...s.items] })));
  const [inp, sInp] = useState({});
  return <div>
    <div className="ah"><h1>Skills</h1></div>
    {sk.map((c, ci) => <div key={ci} className="ac">
      <div className="ach"><input className="acti" value={c.title} onChange={e => { const n = [...sk]; n[ci] = { ...n[ci], title: e.target.value }; sSk(n); }} /><button className="ab ad as" onClick={() => sSk(sk.filter((_, j) => j !== ci))}>✕</button></div>
      <div className="atags">{c.items.map((it, ii) => <span key={ii} className="achip">{it}<span className="achipx" onClick={() => { const n=[...sk];n[ci]={...n[ci],items:n[ci].items.filter((_,j)=>j!==ii)};sSk(n); }}>×</span></span>)}</div>
      <div className="atr"><input className="ai" placeholder="Add skill..." value={inp[ci]||''} onChange={e => sInp({...inp,[ci]:e.target.value})} onKeyDown={e => { if (e.key==='Enter'&&(inp[ci]||'').trim()) { const n=[...sk];n[ci]={...n[ci],items:[...n[ci].items,inp[ci].trim()]};sSk(n);sInp({...inp,[ci]:''}); } }} /><button className="ab ag as" onClick={() => { if ((inp[ci]||'').trim()) { const n=[...sk];n[ci]={...n[ci],items:[...n[ci].items,inp[ci].trim()]};sSk(n);sInp({...inp,[ci]:''}); } }}>Add</button></div>
    </div>)}
    <div className="abr"><button className="ab ag" onClick={() => sSk([...sk, { title: 'New', icon: '⚡', items: [] }])}>+ Category</button><button className="ab aa" onClick={() => save({ ...data, skills: sk })}>💾 Save</button></div>
  </div>;
}

// ===== GENERIC LIST =====
function ListEd({ data, save, k, t, fields, empty }) {
  const [items, sI] = useState(data[k].map(it => ({ ...it })));
  return <div>
    <div className="ah"><h1>{t}</h1></div>
    {items.map((item, i) => <div key={i} className="ac">
      <div className="ach"><span className="act">{item[fields[0].k] || `Item ${i+1}`}</span><button className="ab ad as" onClick={() => sI(items.filter((_, j) => j !== i))}>✕</button></div>
      {fields.map(f => <div key={f.k} className="afg"><label className="al">{f.l}</label>
        {f.type === 'ta' ? <textarea className="at" value={item[f.k]||''} onChange={e => { const n=[...items];n[i]={...n[i],[f.k]:e.target.value};sI(n); }} />
        : f.type === 'list' ? <textarea className="at" placeholder="One per line" value={(item[f.k]||[]).join('\n')} onChange={e => { const n=[...items];n[i]={...n[i],[f.k]:e.target.value.split('\n')};sI(n); }} />
        : f.type === 'tags' ? <input className="ai" placeholder="Comma-separated" value={(item[f.k]||[]).join(', ')} onChange={e => { const n=[...items];n[i]={...n[i],[f.k]:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)};sI(n); }} />
        : <input className="ai" value={item[f.k]||''} onChange={e => { const n=[...items];n[i]={...n[i],[f.k]:e.target.value};sI(n); }} />}
      </div>)}
    </div>)}
    <div className="abr"><button className="ab ag" onClick={() => sI([...items, { ...empty }])}>+ Add</button><button className="ab aa" onClick={() => save({ ...data, [k]: items })}>💾 Save</button></div>
  </div>;
}

// ===== CONTACT =====
function ContactEd({ data, save }) {
  const [c, sC] = useState({ ...data.contact });
  const u = (k, v) => sC({ ...c, [k]: v });
  return <div>
    <div className="ah"><h1>Contact</h1></div>
    <F l="Intro" v={c.text} onChange={v => u('text', v)} ta />
    <F l="Email" v={c.email} onChange={v => u('email', v)} />
    <F l="LinkedIn" v={c.linkedin} onChange={v => u('linkedin', v)} />
    <F l="GitHub" v={c.github} onChange={v => u('github', v)} />
    <button className="ab aa" onClick={() => save({ ...data, contact: c })}>💾 Save</button>
  </div>;
}

// ===== BLOGS =====
function BlogsEd({ data, save }) {
  const [blogs, sB] = useState(data.blogs.map(b => ({ ...b, tags: [...(b.tags || [])] })));
  const [ed, sEd] = useState(null);

  if (ed !== null) {
    const b = blogs[ed];
    const u = (k, v) => { const n = [...blogs]; n[ed] = { ...n[ed], [k]: v }; sB(n); };
    return <div>
      <button className="ab ag as" style={{ marginBottom: 20 }} onClick={() => sEd(null)}>← Back</button>
      <div className="ah"><h1>{b.title || 'New Post'}</h1></div>
      <div className="a2c"><F l="Title" v={b.title} onChange={v => u('title', v)} /><F l="Slug" v={b.id} onChange={v => u('id', v.toLowerCase().replace(/[^a-z0-9-]/g,'-'))} /></div>
      <div className="a2c">
        <div className="afg"><label className="al">Date</label><input className="ai" type="date" value={b.date} onChange={e => u('date', e.target.value)} /></div>
        <F l="Tags (comma-sep)" v={(b.tags||[]).join(', ')} onChange={v => u('tags', v.split(',').map(s=>s.trim()).filter(Boolean))} />
      </div>
      <F l="Excerpt" v={b.excerpt} onChange={v => u('excerpt', v)} ta />
<<<<<<< HEAD
      <div className="a2c">
        <F l="Series ID (optional — groups posts, e.g. nis2-landing-zone)" v={b.seriesId || ''} onChange={v => u('seriesId', v.trim() || undefined)} />
        <div className="afg"><label className="al">Part # (order within series)</label><input className="ai" type="number" value={b.part ?? ''} onChange={e => u('part', e.target.value === '' ? undefined : Number(e.target.value))} /></div>
      </div>
=======
>>>>>>> 704eb1b588ea1cdee9c451cdaeca688355a9a403
      <label className="al">Content (Markdown)</label>
      <div className="mde">
        <div className="mde-p"><div className="mde-h">✎ Editor</div><textarea className="mde-ta" value={b.content} onChange={e => u('content', e.target.value)} /></div>
        <div className="mde-p"><div className="mde-h">◉ Preview</div><div className="mde-pv" dangerouslySetInnerHTML={{ __html: md(b.content) }} /></div>
      </div>
      <div className="abr" style={{ marginTop: 16, alignItems: 'center' }}>
        <label className="atgl" onClick={() => u('published', !b.published)}>
          <div className={`atgl-t ${b.published?'on':''}`}><div className="atgl-k" /></div>
          {b.published ? 'Published' : 'Draft'}
        </label>
        <div style={{ flex: 1 }} />
        <button className="ab aa" onClick={() => { save({ ...data, blogs }); sEd(null); }}>💾 Save Post</button>
      </div>
    </div>;
  }

  return <div>
    <div className="ah"><h1>Blog Posts</h1><p>Write and manage articles</p></div>
    <button className="ab aa" style={{ marginBottom: 20 }} onClick={() => { const n = [...blogs, { id: `post-${Date.now()}`, title: '', date: new Date().toISOString().slice(0, 10), excerpt: '', content: '# New Post\n\nStart writing...', tags: [], published: false }]; sB(n); sEd(n.length - 1); }}>+ New Post</button>
    {blogs.map((b, i) => <div key={i} className="ac acc" onClick={() => sEd(i)}>
      <div className="ach"><div><div className="act">{b.title || 'Untitled'}</div><div className="acm">{b.date} · {b.published ? '✓ Published' : 'Draft'}</div></div>
        <div className="abr"><button className="ab ag as" onClick={e => { e.stopPropagation(); sEd(i); }}>Edit</button><button className="ab ad as" onClick={e => { e.stopPropagation(); const n = blogs.filter((_, j) => j !== i); sB(n); save({ ...data, blogs: n }); }}>✕</button></div>
      </div>
      {b.excerpt && <p className="acd">{b.excerpt}</p>}
    </div>)}
  </div>;
}
