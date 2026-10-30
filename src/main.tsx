import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'

/**
 * Pages are split by route. The shared Layout suspends on a skeleton while a
 * chunk loads, which keeps the first paint small on slow mobile connections.
 */
const Home = lazy(() => import('./pages/Home'))
const Encounter = lazy(() => import('./pages/Encounter'))
const Browse = lazy(() => import('./pages/Browse'))
const Agencies = lazy(() => import('./pages/Agencies'))
const Search = lazy(() => import('./pages/Search'))
const Help = lazy(() => import('./pages/Help'))
const About = lazy(() => import('./pages/About'))
const Settings = lazy(() => import('./pages/Settings'))
const Scenario = lazy(() => import('./pages/Scenario'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
          <Route path="/settings" element={<Settings />} />
          <Route path="/scenario/:id" element={<Scenario />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
