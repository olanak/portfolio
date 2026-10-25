import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal, Counter } from '../components/Shared';
import { landingEntries } from '../utils';
import './Portfolio.css';

const NAV = [
  ['profile', 'Profile'],
  ['focus', 'Focus'],
  ['capabilities', 'Capabilities'],
  ['experience', 'Experience'],
  ['credentials', 'Credentials'],
  ['work', 'Work'],
  ['writing', 'Writing'],
  ['contact', 'Contact'],
];

// Static access-policy panel in the hero — sets the IAM tone without any motion cost
const POLICY_ROWS = [
  { k: 'principal', v: '"olana.kenea"', t: 's' },
  { k: 'effect', v: '"allow"', t: 'ok' },
  { k: 'actions', v: '["secure:infra", "manage:identity", "author:iac"]', t: 'a' },
  { k: 'scope', v: '["eu-central-1", "global"]', t: 'a' },
  { k: 'condition', v: 'mfa == true', t: 'k' },
  { k: 'session_max', v: '1h', t: 'n' },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function SectionHead({ num, kicker, title, sub }) {
  return (
    <Reveal className="sec-head">
      <div className="sec-kicker"><span className="sec-num">{num}</span><span className="sec-slash">/</span>{kicker}</div>
      <h2 className="sec-title">{title}</h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </Reveal>
  );
}

export default function Portfolio({ data }) {
  const nav = useNavigate();
  const { hero, about, skills, experience, certifications, education, projects, contact, focus, frameworks } = data;
  const pillars = focus || [];
  const band = frameworks || [];
  const pub = landingEntries(data);

  const [projFilter, setProjFilter] = useState('All');
  const [openProj, setOpenProj] = useState(null);
  const projCats = ['All', ...Array.from(new Set(projects.flatMap(p => p.categories || [])))];
  const shownProjects = projFilter === 'All' ? projects : projects.filter(p => (p.categories || []).includes(projFilter));

  // Nav scroll state
  useEffect(() => {
    const handler = () => {
      const el = document.getElementById('pnav');
      if (el) el.classList.toggle('solid', window.scrollY > 24);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Terminal line
  useEffect(() => {
    const el = document.getElementById('tw');
    if (!el) return;
    const txt = '> policy.evaluate(principal) → ALLOW';
    let i = 0;
    const t = setInterval(() => { if (i < txt.length) { el.textContent += txt.charAt(i); i++; } else clearInterval(t); }, 42);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pf">
      {/* ===== NAV ===== */}
      <nav className="pn" id="pnav">
        <a href="/" className="pn-brand" onClick={e => { e.preventDefault(); scrollTo('hero'); }}>
          <span className="pn-mark">OK</span>
          <span className="pn-name">Olana Kenea<em>.sec</em></span>
        </a>

        <div className="pn-links" id="pnl">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="pn-a" onClick={e => { e.preventDefault(); scrollTo(id); document.getElementById('pnl')?.classList.remove('open'); }}>{label}</a>
          ))}
        </div>

        <div className="pn-right">
          <span className="pn-status"><i className="dot" />Available</span>
          <a href={`mailto:${contact.email}`} className="pn-cta">Contact</a>
          <button className="pn-burger" aria-label="Menu" onClick={() => document.getElementById('pnl')?.classList.toggle('open')}>☰</button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header id="hero" className="hero">
        <div className="hero-inner">
          <div className="hero-main">
            <Reveal><span className="pill pill-live"><i className="dot" />{hero.statusText}</span></Reveal>

            <Reveal delay={70}><div className="hero-cmd"><span id="tw" /><span className="caret" /></div></Reveal>

            <Reveal delay={140}><h1 className="hero-name">{hero.name}</h1></Reveal>

            <Reveal delay={210}><p className="hero-role">{hero.tagline}</p></Reveal>

            <Reveal delay={280}><p className="hero-sum">{hero.summary}</p></Reveal>

            <Reveal delay={350}>
              <div className="hero-tags">{hero.tags.map((t, i) => <span key={i} className={`htag ${i < 2 ? 'htag-a' : ''}`}>{t}</span>)}</div>
            </Reveal>

            <Reveal delay={420}>
              <div className="hero-cta">
                <button className="btn btn-p" onClick={() => scrollTo('contact')}>Get in touch →</button>
                <button className="btn btn-o" onClick={() => scrollTo('work')}>View work</button>
                <a href={hero.githubUrl} target="_blank" rel="noreferrer" className="btn btn-g">GitHub ↗</a>
                {hero.cvUrl && <a href={hero.cvUrl} download className="btn btn-g btn-cv">↓ CV</a>}
              </div>
            </Reveal>

            <Reveal delay={490}>
              <div className="hero-meta">
                <span><i className="meta-i">📍</i>{hero.locationText}</span>
                <span className="meta-sep" />
                <span><i className="meta-i">⌘</i>Open to EU roles</span>
              </div>
            </Reveal>
          </div>

          {/* Access-policy panel */}
          <Reveal delay={300} className="hero-panel">
            <div className="panel">
              <div className="panel-bar">
                <span className="panel-dots"><i /><i /><i /></span>
                <span className="panel-file">access-policy.json</span>
                <span className="panel-tag">signed</span>
              </div>
              <div className="panel-body">
                <div className="pl-line"><span className="pl-ln">{'{ '}</span></div>
                {POLICY_ROWS.map((r, i) => (
                  <div className="pl-line" key={r.k}>
                    <span className="pl-ln">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pl-k">"{r.k}"</span>
                    <span className="pl-c">:</span>
                    <span className={`pl-v v-${r.t}`}>{r.v}</span>
                    {i < POLICY_ROWS.length - 1 && <span className="pl-c">,</span>}
                  </div>
                ))}
                <div className="pl-line"><span className="pl-ln">{'}'}</span></div>
              </div>
              <div className="panel-foot"><i className="dot" /><span>decision: allow</span><span className="panel-foot-r">evaluated · just now</span></div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={560}>
          <div className="hero-stats">
            {about.stats.map((s, i) => {
              const m = String(s.number).match(/^(\d+)(.*)$/);
              return (
                <div className="hs" key={i}>
                  <span className="hs-n">{m ? <Counter end={Number(m[1])} suffix={m[2]} /> : s.number}</span>
                  <span className="hs-l">{s.label}</span>
                </div>
              );
            })}
          </div>
        </Reveal>

        <a href="#profile" className="scroll-cue" onClick={e => { e.preventDefault(); scrollTo('profile'); }}>
          <span>Scroll</span><i>↓</i>
        </a>
      </header>

      {/* ===== FRAMEWORK BAND ===== */}
      {band.length > 0 && (
        <section className="fwb" aria-label="Frameworks">
          <div className="fwb-inner">
            <span className="fwb-label">Frameworks I build against</span>
            <div className="fwb-list">
              {band.map(f => (
                <span className="fwb-item" key={f.name}><b>{f.name}</b><em>{f.note}</em></span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 01 PROFILE ===== */}
      <section id="profile" className="sec">
        <SectionHead
          num="01"
          kicker="Profile"
          title={<>Security built from the <span className="grad-text">ground up</span></>}
        />
        <div className="profile-grid">
          <div className="profile-bio">
            {(Array.isArray(about.bio) ? about.bio : about.bio.split('\n\n')).map((p, i) => (
              <Reveal key={i} delay={80 + i * 60}>
                <p dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={220} className="profile-facts">
            <div className="facts">
              <div className="facts-head"><span>Quick facts</span><i className="dot" /></div>
              <dl className="facts-list">
                {about.infos.map((c, i) => (
                  <div className="fact" key={i}>
                    <dt><span className="fact-i">{c.icon}</span>{c.label}</dt>
                    <dd>{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 02 FOCUS ===== */}
      <section id="focus" className="sec sec-alt">
        <SectionHead
          num="02"
          kicker="Focus areas"
          title={<>Four domains, <span className="grad-text">one control plane</span></>}
          sub="Where I spend my time — infrastructure, the identity layer that governs it, the code that provisions it, and the regulation that makes it auditable."
        />
        <div className="focus-grid">
          {pillars.map((f, i) => (
            <Reveal key={f.num || i} delay={i * 70} className="focus-cell">
              <article className="focus-card">
                <div className="focus-top">
                  <span className="focus-num">{f.num}</span>
                  <span className="focus-rule" />
                </div>
                <h3 className="focus-t">{f.title}</h3>
                <p className="focus-d">{f.desc}</p>
                <ul className="focus-list">
                  {f.points.map(p => <li key={p}>{p}</li>)}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== 03 CAPABILITIES ===== */}
      <section id="capabilities" className="sec">
        <SectionHead
          num="03"
          kicker="Capabilities"
          title={<>Technical <span className="grad-text">inventory</span></>}
          sub="Grouped by domain the way an auditor would read it: what it is, and what's actually in it."
        />
        <div className="cap-list">
          {skills.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 50} className="cap-row">
              <div className="cap-key">
                <span className="cap-code">D{String(i + 1).padStart(2, '0')}</span>
                <h3>{cat.title}</h3>
              </div>
              <div className="cap-vals">
                {cat.items.map(s => <span key={s}>{s}</span>)}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== 04 EXPERIENCE ===== */}
      <section id="experience" className="sec sec-alt">
        <SectionHead
          num="04"
          kicker="Experience"
          title={<>Where I've <span className="grad-text">kept things running</span></>}
          sub="Critical infrastructure first — power grids and core banking — now carried into cloud accounts and identity systems."
        />
        <div className="xp-list">
          {experience.map((exp, i) => (
            <Reveal key={i} delay={i * 70} className="xp-row">
              <div className="xp-when">
                <span className="xp-dot" />
                <span className="xp-date">{exp.date}</span>
              </div>
              <div className="xp-body">
                <div className="xp-head">
                  <h3 className="xp-role">{exp.role}</h3>
                  <span className="xp-org">{exp.company} · {exp.location}</span>
                </div>
                <ul className="xp-list-i">
                  {exp.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== 05 CREDENTIALS ===== */}
      <section id="credentials" className="sec">
        <SectionHead
          num="05"
          kicker="Credentials"
          title={<>Verified <span className="grad-text">& in progress</span></>}
        />

        <div className="cred-block">
          <h3 className="block-t"><span className="block-k">Certifications</span></h3>
          <div className="cert-grid">
            {certifications.map((c, i) => (
              <Reveal key={c.name} delay={i * 70} className="cert-cell">
                <div className="cert-card">
                  <div className="cert-top">
                    <span className="cert-y">{c.year}</span>
                    <span className="cert-badge">{c.badge}</span>
                  </div>
                  <h4 className="cert-n">{c.name}</h4>
                  <span className="cert-iss">{c.issuer}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="cred-block">
          <h3 className="block-t"><span className="block-k">Education</span></h3>
          <div className="edu-list">
            {education.map((e, i) => (
              <Reveal key={i} delay={i * 60} className="edu-row">
                <div className={`edu-st ${e.status === 'Current' ? 'edu-st-g' : e.status === 'Accepted' ? 'edu-st-b' : ''}`}>{e.status}</div>
                <div className="edu-body">
                  <h4 className="edu-deg">{e.degree}</h4>
                  <span className="edu-sch">{e.school}</span>
                </div>
                <span className="edu-meta">{e.meta}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 06 WORK ===== */}
      <section id="work" className="sec sec-alt">
        <SectionHead
          num="06"
          kicker="Selected work"
          title={<>Projects & <span className="grad-text">build journals</span></>}
        />

        {projCats.length > 2 && (
          <Reveal delay={100}>
            <div className="proj-filters">
              {projCats.map(c => (
                <button key={c} className={`proj-chip ${projFilter === c ? 'on' : ''}`} onClick={() => { setProjFilter(c); setOpenProj(null); }}>{c}</button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="proj-grid">
          {shownProjects.map((p, i) => {
            const open = openProj === p.title;
            const hasDetail = p.problem || p.approach || p.outcome;
            return (
              <Reveal key={p.title} delay={i * 80} className="proj-cell">
                <article className={`proj-card ${open ? 'open' : ''}`}>
                  <div className="proj-head">
                    <div className="proj-num">{String(i + 1).padStart(2, '0')}</div>
                    {(p.categories || []).length > 0 && (
                      <div className="proj-cats">{p.categories.map(c => <span key={c}>{c}</span>)}</div>
                    )}
                  </div>
                  <h3 className="proj-t">{p.title}</h3>
                  <p className="proj-d">{p.desc}</p>
                  <div className="proj-tech">{p.tech.map(t => <span key={t}>{t}</span>)}</div>

                  {open && hasDetail && (
                    <div className="proj-detail">
                      {p.problem && <div className="pd-row"><span className="pd-l">Problem</span><p>{p.problem}</p></div>}
                      {p.approach && <div className="pd-row"><span className="pd-l">Approach</span><p>{p.approach}</p></div>}
                      {p.outcome && <div className="pd-row"><span className="pd-l">Outcome</span><p>{p.outcome}</p></div>}
                    </div>
                  )}

                  <div className="proj-actions">
                    {hasDetail && (
                      <button className="proj-toggle" onClick={() => setOpenProj(open ? null : p.title)} aria-expanded={open}>
                        {open ? 'Collapse −' : 'Details +'}
                      </button>
                    )}
                    {p.seriesId && <span className="proj-link" role="button" tabIndex={0} onClick={() => nav(`/series/${p.seriesId}`)} onKeyDown={e => e.key === 'Enter' && nav(`/series/${p.seriesId}`)}>Build journal →</span>}
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="proj-link" onClick={e => e.stopPropagation()}>GitHub ↗</a>}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===== 07 WRITING ===== */}
      <section id="writing" className="sec">
        <SectionHead
          num="07"
          kicker="Writing"
          title={<>Field notes & <span className="grad-text">build journals</span></>}
          sub="Long-form write-ups of what I built, what broke, and what I'd do differently."
        />

        {pub.length === 0 ? (
          <Reveal delay={120}><div className="empty-box">🔒 Posts coming soon — stay tuned.</div></Reveal>
        ) : (
          <div className="blog-grid">
            {pub.map((e, i) => (
              <Reveal key={e.id} delay={i * 80} className="blog-cell">
                <article
                  className="blog-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => nav(e.type === 'series' ? `/series/${e.id}` : `/blog/${e.id}`)}
                  onKeyDown={ev => ev.key === 'Enter' && nav(e.type === 'series' ? `/series/${e.id}` : `/blog/${e.id}`)}
                >
                  <div className="blog-meta-row">
                    <span className="blog-date">{e.date}</span>
                    {e.type === 'series' && <span className="blog-series-badge">◆ {e.subtitle || 'Series'}</span>}
                  </div>
                  <h3 className="blog-t">{e.title}</h3>
                  <p className="blog-ex">{e.excerpt}</p>
                  <div className="blog-tags">{(e.tags || []).map((t, j) => <span key={j}>{t}</span>)}</div>
                  <span className="blog-more">{e.type === 'series' ? `View series · ${e.written} published →` : 'Read more →'}</span>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ===== 08 CONTACT ===== */}
      <section id="contact" className="sec sec-alt">
        <SectionHead
          num="08"
          kicker="Contact"
          title={<>Let's <span className="grad-text">talk security</span></>}
          sub={contact.text}
        />

        <div className="contact-grid">
          {[
            { icon: '✉', label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
            { icon: 'in', label: 'LinkedIn', value: 'olana-kenea', href: contact.linkedin },
            { icon: '⌥', label: 'GitHub', value: 'olanak', href: contact.github },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 80} className="cc-cell">
              <a href={c.href} target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" className="cc-card">
                <span className="cc-i">{c.icon}</span>
                <span className="cc-body">
                  <span className="cc-l">{c.label}</span>
                  <span className="cc-v">{c.value}</span>
                </span>
                <span className="cc-arrow">↗</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <div className="contact-bar">
            <span className="cb-status"><i className="dot" />{hero.statusText}</span>
            <div className="cb-actions">
              <a href={`mailto:${contact.email}`} className="btn btn-p">Email me →</a>
              {hero.cvUrl && <a href={hero.cvUrl} download className="btn btn-o">↓ Download CV</a>}
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="ft">
        <div className="ft-inner">
          <span className="ft-brand"><span className="pn-mark">OK</span>Olana Kenea Lemesa</span>
          <span className="ft-copy">© 2026 — Infrastructure, Cloud Security & IAM.</span>
          <span className="ft-mono">built with React · deployed static</span>
        </div>
      </footer>
    </div>
  );
}
