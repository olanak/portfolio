import { useParams, useNavigate } from 'react-router-dom';
import { md, postNav } from '../utils';
import './BlogArticle.css';

export default function BlogArticle({ data }) {
  const { slug } = useParams();
  const nav = useNavigate();
  const blog = data.blogs.find(b => b.id === slug);

  if (!blog) return (
    <div className="ba-page">
      <button className="ba-back" onClick={() => nav('/')}>← Back</button>
      <p style={{ color: 'var(--text-3)' }}>Post not found.</p>
    </div>
  );

  return (
    <div className="ba-page">
      <button className="ba-back" onClick={() => nav('/')}>← Back to portfolio</button>
      <span className="ba-date">{blog.date}</span>
      <h1 className="ba-title">{blog.title}</h1>
      <div className="ba-tags">{(blog.tags || []).map((t, i) => <span key={i}>{t}</span>)}</div>
      <article className="ba-body" dangerouslySetInnerHTML={{ __html: md(blog.content) }} />
      <SeriesNav data={data} blog={blog} nav={nav} />
    </div>
  );
}

function SeriesNav({ data, blog, nav }) {
  const info = postNav(data, blog);
  if (!info) return null;
  const { series, prev, next } = info;
  return (
    <nav className="ba-seriesnav">
      <button className="ba-sn-index" onClick={() => nav(`/series/${series.id}`)}>
        ↑ {series.title}
      </button>
      <div className="ba-sn-row">
        {prev ? (
          <button className="ba-sn-link prev" onClick={() => nav(`/blog/${prev.postId}`)}>
            <span className="ba-sn-dir">← Previous</span>
            <span className="ba-sn-t">{prev.title}</span>
          </button>
        ) : <span className="ba-sn-spacer" />}
        {next ? (
          <button className="ba-sn-link next" onClick={() => nav(`/blog/${next.postId}`)}>
            <span className="ba-sn-dir">Next →</span>
            <span className="ba-sn-t">{next.title}</span>
          </button>
        ) : <span className="ba-sn-spacer" />}
      </div>
    </nav>
  );
}
