import { useParams, useNavigate } from 'react-router-dom';
import { md } from '../utils';
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
    </div>
  );
}
