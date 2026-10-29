import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Encounter from './pages/Encounter'
import Browse from './pages/Browse'
import Agencies from './pages/Agencies'
import Search from './pages/Search'
import Help from './pages/Help'
import About from './pages/About'
import Scenario from './pages/Scenario'
import NotFound from './pages/NotFound'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/encounter" element={<Encounter />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/search" element={<Search />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/scenario/:id" element={<Scenario />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
