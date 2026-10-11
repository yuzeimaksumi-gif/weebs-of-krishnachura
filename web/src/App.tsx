import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Tickets from './pages/Tickets'
import Community from './pages/Community'
import Contact from './pages/Contact'
import Placeholder from './pages/Placeholder'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    // reducedMotion="user" turns off movement for people who enabled
    // "reduce motion" in their device settings.
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/magazine" element={<Placeholder eyebrow="E-Magazine" title="The Magazine" stage="Stage 10" />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}