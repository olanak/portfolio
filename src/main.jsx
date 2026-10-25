import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Served at the domain root (custom domain / Vercel) or under the GitHub
// Pages project path (/portfolio/) — pick the matching router basename.
const path = window.location.pathname
const basename = path === '/portfolio' || path.startsWith('/portfolio/') ? '/portfolio' : undefined

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}><App /></BrowserRouter>
  </React.StrictMode>
)
