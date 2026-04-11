import { useEffect, useRef, useState } from 'react';

// ===== CYBERSECURITY PARTICLE CANVAS =====
// Floating hex shapes, lock icons, shield outlines, network connections
export function CyberCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let w, h, raf;
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);

    const mouse = { x: -999, y: -999 };
    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const shapes = Array.from({ length: 45 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 12 + 6,
      type: ['hex', 'shield', 'lock', 'dot', 'key'][Math.floor(Math.random() * 5)],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.008,
      alpha: Math.random() * 0.25 + 0.08,
      color: ['99,102,241', '6,214,160', '139,92,246', '6,182,212'][Math.floor(Math.random() * 4)]
    }));

    const drawHex = (x, y, r, rot) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = rot + (Math.PI / 3) * i;
        const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawShield = (x, y, s, rot) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s, -s * 0.5, s, 0);
      ctx.quadraticCurveTo(s, s * 0.8, 0, s * 1.2);
      ctx.quadraticCurveTo(-s, s * 0.8, -s, 0);
      ctx.quadraticCurveTo(-s, -s * 0.5, 0, -s);
      ctx.closePath(); ctx.restore();
    };

    const drawLock = (x, y, s, rot) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.beginPath();
      ctx.rect(-s * 0.5, -s * 0.1, s, s * 0.7);
      ctx.moveTo(-s * 0.25, -s * 0.1);
      ctx.arc(0, -s * 0.1, s * 0.25, Math.PI, 0, false);
      ctx.restore();
    };

    const drawKey = (x, y, s, rot) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.beginPath();
      ctx.arc(0, -s * 0.3, s * 0.25, 0, Math.PI * 2);
      ctx.moveTo(0, -s * 0.05); ctx.lineTo(0, s * 0.5);
      ctx.moveTo(0, s * 0.3); ctx.lineTo(s * 0.15, s * 0.3);
      ctx.moveTo(0, s * 0.45); ctx.lineTo(s * 0.15, s * 0.45);
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        s.x += s.vx; s.y += s.vy; s.rot += s.rotV;
        if (s.x < -20) s.x = w + 20; if (s.x > w + 20) s.x = -20;
        if (s.y < -20) s.y = h + 20; if (s.y > h + 20) s.y = -20;

        const dx = mouse.x - s.x, dy = mouse.y - s.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) { s.x -= dx * 0.01; s.y -= dy * 0.01; }

        ctx.strokeStyle = `rgba(${s.color},${s.alpha})`;
        ctx.lineWidth = 1.2;

        if (s.type === 'hex') { drawHex(s.x, s.y, s.size, s.rot); ctx.stroke(); }
        else if (s.type === 'shield') { drawShield(s.x, s.y, s.size, s.rot); ctx.stroke(); }
        else if (s.type === 'lock') { drawLock(s.x, s.y, s.size, s.rot); ctx.stroke(); }
        else if (s.type === 'key') { drawKey(s.x, s.y, s.size, s.rot); ctx.stroke(); }
        else {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},${s.alpha * 1.5})`;
          ctx.fill();
        }

        // Network lines between nearby shapes
        for (let j = i + 1; j < shapes.length; j++) {
          const s2 = shapes[j];
          const d = Math.hypot(s.x - s2.x, s.y - s2.y);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'transparent' }} />;
}

// ===== 3D TILT CARD =====
export function Tilt({ children, className = '', style = {} }) {
  const ref = useRef(null);
  const onMove = e => {
    const el = ref.current, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)'; };
  return <div ref={ref} className={className} style={{ transition: 'transform 0.15s ease', willChange: 'transform', ...style }} onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>;
}

// ===== SCROLL REVEAL =====
export function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    // Small timeout ensures layout is complete before observing
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { el.classList.add('vis'); obs.unobserve(el); }
      }, { threshold: 0.05, rootMargin: '50px' });
      obs.observe(el);
      // Cleanup
      return () => obs.disconnect();
    }, 50);
    return () => clearTimeout(timer);
  }, []);
  return <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

// ===== ANIMATED COUNTER =====
export function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const t0 = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / 1500, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(e.target);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val}{suffix}</span>;
}
