// ===== STORAGE =====
const SK = 'olana-portfolio-data';
const AK = 'olana-admin-auth';

export const store = {
  load: () => { try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : null; } catch { return null; } },
  save: (d) => { try { localStorage.setItem(SK, JSON.stringify(d)); return true; } catch { return false; } },
  loadAuth: () => { try { const r = localStorage.getItem(AK); return r ? JSON.parse(r) : null; } catch { return null; } },
  saveAuth: (a) => { try { localStorage.setItem(AK, JSON.stringify(a)); return true; } catch { return false; } },
};

// ===== MARKDOWN PARSER =====
export function md(s) {
  if (!s) return '';
  let h = s
    .replace(/```([\s\S]*?)```/g, (_, c) => `<pre class="md-pre"><code>${c.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>');
  h = h.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
  h = h.replace(/^(?!<[hluobp]|<\/|<hr|<pre|<code)(.+)$/gm, '<p>$1</p>');
  return h;
}
