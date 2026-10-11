import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
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
          <Route path="/about" element={<Placeholder eyebrow="Who we are" title="About Us" stage="Stage 4" />} />
          <Route path="/events" element={<Placeholder eyebrow="What's happening" title="Events" stage="Stage 4" />} />
          <Route path="/tickets" element={<Placeholder eyebrow="Passes" title="Passes & Tickets" stage="Stages 6 to 8" />} />
          <Route path="/magazine" element={<Placeholder eyebrow="E-Magazine" title="The Magazine" stage="Stage 10" />} />
          <Route path="/community" element={<Placeholder eyebrow="Join us" title="Community" stage="Stage 4" />} />
          <Route path="/contact" element={<Placeholder eyebrow="Get in touch" title="Contact & FAQ" stage="Stage 4" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}