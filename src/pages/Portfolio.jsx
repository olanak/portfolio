<<<<<<< HEAD
import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberCanvas, Tilt, Reveal, Counter } from '../components/Shared';
import { landingEntries } from '../utils';
=======
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberCanvas, Tilt, Reveal, Counter } from '../components/Shared';
>>>>>>> 704eb1b588ea1cdee9c451cdaeca688355a9a403
import './Portfolio.css';

export default function Portfolio({ data }) {
  const nav = useNavigate();
  const { hero, about, skills, experience, certifications, education, projects, contact, blogs } = data;
<<<<<<< HEAD
  const pub = landingEntries(data);

  const [projFilter, setProjFilter] = useState('All');
  const [openProj, setOpenProj] = useState(null);
  const projCats = ['All', ...Array.from(new Set(projects.flatMap(p => p.categories || [])))];
  const shownProjects = projFilter === 'All' ? projects : projects.filter(p => (p.categories || []).includes(projFilter));
=======
  const pub = blogs.filter(b => b.published);
>>>>>>> 704eb1b588ea1cdee9c451cdaeca688355a9a403

  // Nav scroll
  useEffect(() => {
    const handler = () => {
      const el = document.getElementById('pnav');
      if (el) el.classList.toggle('solid', window.scrollY > 40);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Typewriter
  useEffect(() => {
    const el = document.getElementById('tw');
    if (!el) return;
    const txt = '> securing cloud infrastructure...';
    let i = 0;
    const t = setInterval(() => { if (i < txt.length) { el.textContent += txt.charAt(i); i++; } else clearInterval(t); }, 45);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pf">
      <CyberCanvas />
      {/* Nav */}
      <nav className="pn" id="pnav">
        <a href="/" onClick={e => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }); }} className="pn-logo"><span className="pn-icon">◆</span>Olana<span className="pn-d">.sec</span></a>
        <div className="pn-links" id="pnl">
          {['about','skills','experience','certs','projects','blog','contact'].map(s =>
            <a key={s} href={`#${s}`} className="pn-a" onClick={e => {
              e.preventDefault();
              document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' });
              document.getElementById('pnl').classList.remove('open');
            }}>{s}</a>
          )}
          <a href={`mailto:${contact.email}`} className="pn-cta">Hire Me</a>
        </div>
        <button className="pn-burger" onClick={() => document.getElementById('pnl').classList.toggle('open')}>☰</button>
      </nav>

      {/* Hero */}
      <section id="hero" className="hero">
        <div className="hero-c">
          <Reveal><span className="hero-badge">🛡️ {hero.statusText}</span></Reveal>
          <Reveal delay={120}><div className="hero-tw"><span id="tw"></span><span className="tw-cursor" /></div></Reveal>
          <Reveal delay={200}><h1 className="hero-h">Hi, I'm <span className="grad-text">{hero.name.split(' ').slice(0, 2).join(' ')}</span></h1></Reveal>
          <Reveal delay={300}><p className="hero-sub">{hero.tagline}</p></Reveal>
          <Reveal delay={400}>
            <div className="hero-tags">{hero.tags.map((t, i) => <span key={i} className={`htag ${i < 2 ? 'htag-a' : ''}`}>{t}</span>)}</div>
          </Reveal>
          <Reveal delay={500}>
            <div className="hero-btns">
              <a href="#contact" className="btn btn-p" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>→ Get in Touch</a>
              <a href="#projects" className="btn btn-o" onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>View Projects</a>
              <a href={hero.githubUrl} target="_blank" rel="noreferrer" className="btn btn-g">GitHub ↗</a>
<<<<<<< HEAD
              {hero.cvUrl && <a href={hero.cvUrl} download className="btn btn-cv">⬇ Download CV</a>}
=======
>>>>>>> 704eb1b588ea1cdee9c451cdaeca688355a9a403
            </div>
          </Reveal>
          <Reveal delay={650}>
            <div className="hero-stats">
<<<<<<< HEAD
              {about.stats.map((s, i) => {
                const m = String(s.number).match(/^(\d+)(.*)$/);
                return (
                  <Fragment key={i}>
                    {i > 0 && <div className="hs-sep" />}
                    <div className="hs">
                      <span className="hs-n">{m ? <Counter end={Number(m[1])} suffix={m[2]} /> : s.number}</span>
                      <span className="hs-l">{s.label}</span>
                    </div>
                  </Fragment>
                );
              })}
=======
              <div className="hs"><span className="hs-n"><Counter end={6} suffix="+" /></span><span className="hs-l">Years in IT</span></div>
              <div className="hs-sep" />
              <div className="hs"><span className="hs-n"><Counter end={3} /></span><span className="hs-l">Certifications</span></div>
              <div className="hs-sep" />
              <div className="hs"><span className="hs-n"><Counter end={2} /></span><span className="hs-l">Master's Degrees</span></div>
              <div className="hs-sep" />
              <div className="hs"><span className="hs-n"><Counter end={40} suffix="+" /></span><span className="hs-l">Skills</span></div>
>>>>>>> 704eb1b588ea1cdee9c451cdaeca688355a9a403
            </div>
          </Reveal>
        </div>
        <div className="hero-scroll"><span>Scroll to explore</span><div className="scroll-arr">↓</div></div>
      </section>

      {/* About */}
      <section id="about" className="sec">
        <Reveal><span className="stag">About Me</span></Reveal>
        <Reveal delay={80}><h2 className="sh">Building security from the <span className="grad-text">ground up</span></h2></Reveal>
        <div className="about-g">
          <div className="about-txt">
            {(Array.isArray(about.bio) ? about.bio : about.bio.split('\n\n')).map((p, i) => <Reveal key={i} delay={120 + i * 80}><p dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} /></Reveal>)}
          </div>
          <div className="about-side">
            <div className="about-stats">
              {about.stats.map((s, i) => <Reveal key={i} delay={150 + i * 80}><Tilt className="astat"><div className="astat-n">{s.number}</div><div className="astat-l">{s.label}</div></Tilt></Reveal>)}
            </div>
            <div className="about-infos">
              {about.infos.map((c, i) => <Reveal key={i} delay={200 + i * 80}><Tilt className="ainfo"><span className="ainfo-i">{c.icon}</span><span className="ainfo-l">{c.label}</span><span className="ainfo-v">{c.value}</span></Tilt></Reveal>)}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="sec sec-alt">
        <Reveal><span className="stag">Technical Arsenal</span></Reveal>
        <Reveal delay={80}><h2 className="sh">Skills & <span className="grad-text">Technologies</span></h2></Reveal>
        <div className="sk-grid">
          {skills.map((cat, i) => (
            <Reveal key={i} delay={i * 80}>
              <Tilt className="sk-card">
                <div className="sk-head"><span className="sk-icon">{cat.icon}</span><h3>{cat.title}</h3></div>
                <div className="sk-chips">{cat.items.map(s => <span key={s} className="sk-chip">{s}</span>)}</div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="sec">
        <Reveal><span className="stag">Experience</span></Reveal>
        <Reveal delay={80}><h2 className="sh">Where I've <span className="grad-text">built things</span></h2></Reveal>
        <div className="tl">
          {experience.map((exp, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="tl-item">
                <div className="tl-dot" />
                <Tilt className="tl-card">
                  <span className="tl-date">{exp.date}</span>
                  <h3 className="tl-role">{exp.role}</h3>
                  <span className="tl-co">{exp.company} — {exp.location}</span>
                  <ul className="tl-list">{exp.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                </Tilt>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Certs */}
      <section id="certs" className="sec sec-alt">
        <Reveal><span className="stag">Certifications</span></Reveal>
        <Reveal delay={80}><h2 className="sh">Verified <span className="grad-text">Credentials</span></h2></Reveal>
        <div className="cert-grid">
          {certifications.map((c, i) => (
            <Reveal key={i} delay={i * 100}>
              <Tilt className="cert-card">
                <div className="cert-glow" />
                <span className="cert-y">{c.year}</span>
                <h3 className="cert-n">{c.name}</h3>
                <span className="cert-iss">{c.issuer}</span>
                <span className="cert-badge">{c.badge}</span>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="sec">
        <Reveal><span className="stag">Education</span></Reveal>
        <Reveal delay={80}><h2 className="sh">Academic <span className="grad-text">Foundation</span></h2></Reveal>
        <div className="edu-grid">
          {education.map((e, i) => (
            <Reveal key={i} delay={i * 80}>
              <Tilt className="edu-card">
                {e.status && <span className={`edu-st ${e.status === 'Current' ? 'edu-st-g' : 'edu-st-b'}`}>{e.status}</span>}
                <h3 className="edu-deg">{e.degree}</h3>
                <span className="edu-sch">{e.school}</span>
                <span className="edu-meta">{e.meta}</span>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="sec sec-alt">
        <Reveal><span className="stag">Projects</span></Reveal>
        <Reveal delay={80}><h2 className="sh">What I've <span className="grad-text">Built</span></h2></Reveal>
<<<<<<< HEAD

        {projCats.length > 2 && (
          <Reveal delay={120}>
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
              <Reveal key={p.title} delay={i * 100}>
                <Tilt className={`proj-card ${open ? 'open' : ''}`}>
                  <div className="proj-head">
                    <div className="proj-num">0{i + 1}</div>
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
                        {open ? 'Less −' : 'Details +'}
                      </button>
                    )}
                    {p.seriesId && <span className="proj-link" onClick={() => nav(`/series/${p.seriesId}`)} style={{ cursor: 'pointer' }}>Build journal →</span>}
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="proj-link" onClick={e => e.stopPropagation()}>GitHub ↗</a>}
                  </div>
                </Tilt>
              </Reveal>
            );
          })}
=======
        <div className="proj-grid">
          {projects.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <Tilt className="proj-card">
                <div className="proj-num">0{i + 1}</div>
                <h3 className="proj-t">{p.title}</h3>
                <p className="proj-d">{p.desc}</p>
                <div className="proj-tech">{p.tech.map(t => <span key={t}>{t}</span>)}</div>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="proj-link">View on GitHub ↗</a>}
              </Tilt>
            </Reveal>
          ))}
>>>>>>> 704eb1b588ea1cdee9c451cdaeca688355a9a403
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="sec">
        <Reveal><span className="stag">Blog</span></Reveal>
        <Reveal delay={80}><h2 className="sh">Thoughts & <span className="grad-text">Write-ups</span></h2></Reveal>
        {pub.length === 0 ? (
          <Reveal delay={150}><div className="empty-box">🔒 Blog posts coming soon — stay tuned.</div></Reveal>
        ) : (
          <div className="blog-grid">
<<<<<<< HEAD
            {pub.map((e, i) => (
              <Reveal key={e.id} delay={i * 100}>
                <Tilt className="blog-card" style={{ cursor: 'pointer' }}>
                  <div onClick={() => nav(e.type === 'series' ? `/series/${e.id}` : `/blog/${e.id}`)}>
                    <div className="blog-meta-row">
                      <span className="blog-date">{e.date}</span>
                      {e.type === 'series' && <span className="blog-series-badge">◆ {e.subtitle || 'Series'}</span>}
                    </div>
                    <h3 className="blog-t">{e.title}</h3>
                    <p className="blog-ex">{e.excerpt}</p>
                    <div className="blog-tags">{(e.tags || []).map((t, j) => <span key={j}>{t}</span>)}</div>
                    <span className="blog-more">{e.type === 'series' ? `View series · ${e.written} published →` : 'Read more →'}</span>
=======
            {pub.map((b, i) => (
              <Reveal key={i} delay={i * 100}>
                <Tilt className="blog-card" style={{ cursor: 'pointer' }}>
                  <div onClick={() => nav(`/blog/${b.id}`)}>
                    <span className="blog-date">{b.date}</span>
                    <h3 className="blog-t">{b.title}</h3>
                    <p className="blog-ex">{b.excerpt}</p>
                    <div className="blog-tags">{(b.tags || []).map((t, j) => <span key={j}>{t}</span>)}</div>
                    <span className="blog-more">Read more →</span>
>>>>>>> 704eb1b588ea1cdee9c451cdaeca688355a9a403
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section id="contact" className="sec sec-alt">
        <Reveal><span className="stag">Contact</span></Reveal>
        <Reveal delay={80}><h2 className="sh">Let's <span className="grad-text">Connect</span></h2></Reveal>
        <Reveal delay={150}><p className="contact-txt">{contact.text}</p></Reveal>
        <div className="contact-grid">
          {[
            { icon: '✉️', label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
            { icon: '💼', label: 'LinkedIn', value: 'olana-kenea', href: contact.linkedin },
            { icon: '⌨️', label: 'GitHub', value: 'olanakenea', href: contact.github }
          ].map((c, i) => (
            <Reveal key={i} delay={200 + i * 100}>
              <a href={c.href} target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" className="cc-link">
                <Tilt className="cc-card">
                  <span className="cc-i">{c.icon}</span>
                  <span className="cc-l">{c.label}</span>
                  <span className="cc-v">{c.value}</span>
                </Tilt>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="ft">
        <p>© 2026 {hero.name}. Crafted with <span className="grad-text">passion</span> & precision.</p>
      </footer>
    </div>
  );
}
