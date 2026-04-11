# Olana Kenea Lemesa — Cyber Portfolio

Interactive cybersecurity-themed portfolio with blog system and secret admin dashboard.

## ✨ Features

### Public Portfolio
- **Cybersecurity particle canvas** — floating hex shapes, shields, locks, and keys that react to your mouse
- **3D tilt cards** — every card tilts toward your cursor with perspective transforms
- **Scroll-triggered reveals** — elements animate in as you scroll with staggered delays
- **Animated counters** — numbers count up when they enter viewport
- **Smooth single-page navigation** with fixed nav

### Blog System
- Full blog page with markdown rendering
- Code blocks, blockquotes, headings, links all styled
- Tags and dates displayed

### Admin Dashboard (Secret)
- **No visible admin button** — completely hidden from visitors
- Full CMS for every section: Hero, About, Skills, Experience, Certs, Education, Projects, Contact
- **Split-pane Markdown editor** — write on left, live preview on right
- Publish/draft toggle for blog posts
- Tag management across all sections
- Password protected (set on first visit)
- Data persists in localStorage

## 🔐 Secret Admin Access

1. **URL**: Go to `yourdomain.me/#/admin`
2. **Keyboard**: Type `admin` while on the portfolio (not in an input field)

First visit sets your password. Remember it!

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## 📦 Deploy to GitHub Pages

### With Custom Domain (recommended)

1. Buy `olanakenea.me` from Namecheap (~$5/year)
2. Update `public/CNAME` with your domain
3. Push to GitHub:
   ```bash
   git init && git add . && git commit -m "init"
   git remote add origin https://github.com/YOUR_USER/portfolio.git
   git push -u origin main
   ```
4. In GitHub: Settings → Pages → Source: GitHub Actions
5. Configure DNS at registrar:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME: `www` → `YOUR_USER.github.io`
6. In GitHub Pages settings, add custom domain + enable HTTPS

The included GitHub Actions workflow auto-deploys on every push.

### Without Custom Domain

Create repo named `YOUR_USER.github.io`, push, enable Pages.

## 📁 Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router + auth + secret keyboard shortcut
├── index.css             # Global styles + CSS variables
├── data.js               # All portfolio content
├── utils.js              # Storage + markdown parser
├── components/
│   └── Shared.jsx        # CyberCanvas, TiltCard, Reveal, Counter
└── pages/
    ├── Portfolio.jsx/css  # Public portfolio
    ├── BlogArticle.jsx/css # Blog reader
    ├── AdminLogin.jsx     # Admin login
    └── Admin.jsx/css      # Full admin CMS
```

## 🎨 Customization

**Colors**: Edit CSS variables in `src/index.css`
**Content**: Edit `src/data.js` or use the admin dashboard
**Reset all data**: `localStorage.clear()` in browser console

## License
MIT
