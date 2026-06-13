import { useParams, useNavigate } from 'react-router-dom';
import { seriesParts } from '../utils';
import './SeriesIndex.css';

export default function SeriesIndex({ data }) {
  const { id } = useParams();
  const nav = useNavigate();
  const series = (data.series || []).find(s => s.id === id);

  if (!series) return (
    <div className="si-page">
      <button className="si-back" onClick={() => nav('/')}>← Back to portfolio</button>
      <p style={{ color: 'var(--text-3)' }}>Series not found.</p>
    </div>
  );

  const parts = seriesParts(data, series);
  const written = parts.filter(p => p.post).length;

  return (
    <div className="si-page">
      <button className="si-back" onClick={() => nav('/')}>← Back to portfolio</button>

      <span className="si-eyebrow">Series · {written} of {parts.length} published</span>
      <h1 className="si-title">{series.title}</h1>
      {series.subtitle && <p className="si-sub">{series.subtitle}</p>}
      {series.excerpt && <p className="si-excerpt">{series.excerpt}</p>}
      {(series.tags || []).length > 0 &&
        <div className="si-tags">{series.tags.map((t, i) => <span key={i}>{t}</span>)}</div>}

      <ol className="si-list">
        {parts.map((p) => {
          const live = !!p.post;
          return (
            <li
              key={p.part}
              className={`si-item ${live ? 'live' : 'soon'}`}
              onClick={live ? () => nav(`/blog/${p.postId}`) : undefined}
            >
              <span className="si-num">{String(p.part).padStart(2, '0')}</span>
              <div className="si-body">
                <h3 className="si-h">{p.title}</h3>
                {p.summary && <p className="si-s">{p.summary}</p>}
              </div>
              <span className="si-status">{live ? 'Read →' : 'Coming soon'}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
