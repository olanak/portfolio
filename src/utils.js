// ===== STORAGE =====
const SK = 'olana-portfolio-data';
const AK = 'olana-admin-auth';

export const store = {
  load: () => { try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : null; } catch { return null; } },
  save: (d) => { try { localStorage.setItem(SK, JSON.stringify(d)); return true; } catch { return false; } },
  loadAuth: () => { try { const r = localStorage.getItem(AK); return r ? JSON.parse(r) : null; } catch { return null; } },
  saveAuth: (a) => { try { localStorage.setItem(AK, JSON.stringify(a)); return true; } catch { return false; } },
};

// ===== SERIES HELPERS =====
// A part is "live" when a published post declares seriesId + part. The series
// outline supplies titles/summaries for parts not yet written ("coming soon").
export function seriesParts(data, series) {
  const posts = (data.blogs || []).filter(b => b.published && b.seriesId === series.id);
  const byPart = new Map(posts.map(p => [p.part ?? 0, p]));
  const outline = series.outline || [];
  const partNums = [...new Set([...outline.map(o => o.part), ...posts.map(p => p.part ?? 0)])];
  return partNums.sort((a, b) => a - b).map(n => {
    const o = outline.find(x => x.part === n) || {};
    const post = byPart.get(n) || null;
    return {
      part: n,
      title: o.title || post?.title || `Part ${n}`,
      summary: o.summary || post?.excerpt || '',
      postId: post?.id || null,
      post,
    };
  });
}

// One unified, date-sorted list for the landing page: each series collapses to ONE entry
export function landingEntries(data) {
  const seriesIds = new Set((data.series || []).map(s => s.id));

  const series = (data.series || []).map(s => {
    const parts = seriesParts(data, s);
    const written = parts.filter(p => p.post);
    return {
      type: 'series', id: s.id, title: s.title, subtitle: s.subtitle,
      excerpt: s.excerpt, tags: s.tags || [],
      date: s.date || written.map(p => p.post.date).sort().slice(-1)[0] || '',
      written: written.length, total: parts.length,
    };
  }).filter(s => s.written > 0); // don't advertise an empty series

  const standalone = (data.blogs || [])
    .filter(b => b.published && !(b.seriesId && seriesIds.has(b.seriesId)))
    .map(b => ({ type: 'post', id: b.id, title: b.title, excerpt: b.excerpt, tags: b.tags || [], date: b.date }));

  return [...series, ...standalone].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

// For a post page: its series + prev/next across PUBLISHED parts only
export function postNav(data, post) {
  if (!post?.seriesId) return null;
  const series = (data.series || []).find(s => s.id === post.seriesId);
  if (!series) return null;
  const parts = seriesParts(data, series).filter(p => p.post);
  const idx = parts.findIndex(p => p.postId === post.id);
  if (idx === -1) return null;
  return {
    series,
    prev: idx > 0 ? parts[idx - 1] : null,
    next: idx < parts.length - 1 ? parts[idx + 1] : null,
  };
}

// ===== MARKDOWN PARSER =====
// Light inline formatting used inside table cells (escape, then code/bold/italic/links)
function mdInline(t) {
  return t
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function splitRow(l) {
  return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}

export function md(s) {
  if (!s) return '';
  const blocks = [], tables = [], inls = [];

  // 1. Pull fenced code blocks out first (strip language tag, escape HTML)
  let h = s.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, c) => {
    const esc = c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n$/, '');
    return `\u0000B${blocks.push(`<pre class="md-pre"><code>${esc}</code></pre>`) - 1}\u0000`;
  });

  // 2. Detect GitHub-style tables (header row, |---| separator, body rows)
  const isRow = l => /^\s*\|.+\|\s*$/.test(l);
  const isSep = l => /\|/.test(l) && /-/.test(l) && /^\s*\|?[\s:|-]+\|?\s*$/.test(l);
  const lines = h.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (isRow(lines[i]) && i + 1 < lines.length && isSep(lines[i + 1])) {
      const header = splitRow(lines[i]);
      i += 2;
      const rows = [];
      while (i < lines.length && isRow(lines[i])) { rows.push(splitRow(lines[i])); i++; }
      i--; // step back; loop will increment
      const thead = '<thead><tr>' + header.map(c => `<th>${mdInline(c)}</th>`).join('') + '</tr></thead>';
      const tbody = '<tbody>' + rows.map(r => '<tr>' + r.map(c => `<td>${mdInline(c)}</td>`).join('') + '</tr>').join('') + '</tbody>';
      out.push(`\u0000T${tables.push(`<table class="md-table">${thead}${tbody}</table>`) - 1}\u0000`);
    } else {
      out.push(lines[i]);
    }
  }
  h = out.join('\n');

  // 3. Pull inline code out (outside tables/code blocks)
  h = h.replace(/`([^`]+)`/g, (_, c) => {
    const esc = c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `\u0000I${inls.push(`<code class="md-code">${esc}</code>`) - 1}\u0000`;
  });

  // 4. Block + inline transforms
  h = h
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

  // 5. Wrap remaining bare lines in <p> (skip tags + placeholders)
  h = h.replace(/^(?!<[hluobp]|<\/|<hr|<pre|<code|\u0000)(.+)$/gm, '<p>$1</p>');

  // 6. Restore protected blocks
  h = h.replace(/\u0000T(\d+)\u0000/g, (_, i) => tables[+i]);
  h = h.replace(/\u0000B(\d+)\u0000/g, (_, i) => blocks[+i]);
  h = h.replace(/\u0000I(\d+)\u0000/g, (_, i) => inls[+i]);
  return h;
}