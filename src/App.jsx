import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { DATA } from './data';
import { store } from './utils';
import Portfolio from './pages/Portfolio';
import BlogArticle from './pages/BlogArticle';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

export default function App() {
  const [data, setData] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    // Handle GitHub Pages SPA redirect
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      nav(redirect, { replace: true });
    }
  }, [nav]);

  useEffect(() => {
    const s = store.load();
    let d;
    if (s) {
      // Deep merge with defaults to handle missing fields from old data
      d = { ...DATA, ...s };
      d.about = { ...DATA.about, ...s.about };
      // Ensure bio is array format
      if (d.about.bio && !Array.isArray(d.about.bio)) {
        d.about.bio = d.about.bio.split('\n\n');
      }
      // Ensure infos exists
      if (!d.about.infos) d.about.infos = DATA.about.infos;
      if (!d.about.stats) d.about.stats = DATA.about.stats;
      d.blogs = s.blogs || DATA.blogs;
      // Ensure experience items have location
      if (d.experience) {
        d.experience = d.experience.map((e, i) => ({ ...DATA.experience[i], ...e }));
      }
    } else {
      d = DATA;
    }
    setData(d);
    if (!s) store.save(DATA);
    const a = store.loadAuth();
    if (a?.loggedIn) setAuthed(true);
    setLoading(false);
  }, []);

  // Secret: type "admin" on keyboard
  useEffect(() => {
    let buf = '', timer;
    const handler = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      buf += e.key.toLowerCase();
      clearTimeout(timer);
      timer = setTimeout(() => buf = '', 2000);
      if (buf.includes('admin')) { buf = ''; nav('/admin'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nav]);

  const flash = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const save = useCallback(d => {
    setData(d);
    flash(store.save(d) ? 'Saved!' : 'Save failed', store.save(d));
  }, [flash]);

  const login = useCallback(pw => {
    const a = store.loadAuth();
    if (!a?.password) { store.saveAuth({ password: pw, loggedIn: true }); setAuthed(true); flash('Password set!'); return true; }
    if (a.password === pw) { store.saveAuth({ ...a, loggedIn: true }); setAuthed(true); return true; }
    return false;
  }, [flash]);

  const logout = useCallback(() => {
    const a = store.loadAuth();
    if (a) store.saveAuth({ ...a, loggedIn: false });
    setAuthed(false);
    nav('/');
  }, [nav]);

  if (loading || !data) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8f9fd' }}><span style={{ fontFamily: 'var(--mono)', color: '#6366f1' }}>Loading...</span></div>;

  return (
    <>
      {toast && <div className={`toast toast-${toast.ok ? 'ok' : 'err'}`}>{toast.msg}</div>}
      <Routes>
        <Route path="/" element={<Portfolio data={data} />} />
        <Route path="/blog/:slug" element={<BlogArticle data={data} />} />
        <Route path="/admin/*" element={authed ? <Admin data={data} onSave={save} onLogout={logout} /> : <AdminLogin onLogin={login} />} />
      </Routes>
    </>
  );
}
