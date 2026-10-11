import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Error 404"
        title="Page not found"
        subtitle="That page doesn't exist, or it has moved."
      />
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </section>
    </>
  )
}