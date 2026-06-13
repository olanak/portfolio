import { useState, useEffect } from 'react';
import { store } from '../utils';
import './Admin.css';

export default function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [first, setFirst] = useState(null);

  useEffect(() => { const a = store.loadAuth(); setFirst(!a?.password); }, []);

  const go = () => {
    if (!pw.trim()) return setErr('Enter a password');
    if (!onLogin(pw)) setErr('Wrong password');
  };

  return (
    <div className="al-wrap">
      <div className="al-box">
        <div className="al-icon">🛡️</div>
        <h2>Admin Access</h2>
        <p>{first ? 'Set your admin password (first-time setup)' : 'Enter your password'}</p>
        {err && <div className="al-err">{err}</div>}
        <input type="password" className="ai" placeholder={first ? 'Choose a password...' : 'Password...'} value={pw} onChange={e => { setPw(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && go()} autoFocus />
        <button className="btn btn-p" style={{ width: '100%' }} onClick={go}>{first ? 'Set Password & Enter' : 'Unlock'}</button>
        <div className="al-hint">Access: <code>yourdomain/#/admin</code> or type <code>admin</code> on portfolio</div>
      </div>
    </div>
  );
}
