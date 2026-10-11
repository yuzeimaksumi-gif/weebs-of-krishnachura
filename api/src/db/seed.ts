import pg from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is missing. Check api/.env')
  process.exit(1)
}

const client = new pg.Client({ connectionString: url })

// SAMPLE values only. Real names, prices and quantities are set in the admin dashboard.
const SAMPLE_TICKETS = [
  {
    name: '[SAMPLE] Early Bird',
    description: 'Sample ticket type. Not for sale.',
    benefits: ['[Sample benefit]'],
    price: 49900,
    total: 100,
    sort: 1,
  },
  {
    name: '[SAMPLE] Standard',
    description: 'Sample ticket type. Not for sale.',
    benefits: ['[Sample benefit]'],
    price: 79900,
    total: 300,
    sort: 2,
  },
  {
    name: '[SAMPLE] VIP',
    description: 'Sample ticket type. Not for sale.',
    benefits: ['[Sample benefit]', '[Another sample benefit]'],
    price: 199900,
    total: 50,
    sort: 3,
  },
]

async function main() {
  await client.connect()

  const orders = await client.query('SELECT count(*)::int AS n FROM orders')
  if (orders.rows[0].n > 0) {
    console.log('Orders already exist. Refusing to reseed, to protect real data.')
    return
  }

  try {
    await client.query('BEGIN')
    await client.query(`DELETE FROM events WHERE slug = 'sample-event'`)

    const ev = await client.query(
      `INSERT INTO events (slug, name, description, venue, city, is_published)
       VALUES ('sample-event', '[SAMPLE] Sample Event (not real)',
               'Sample data for testing only. Edit or delete before launch.',
               '[Sample venue]', '[Sample city]', false)
       RETURNING id`,
    )
    const eventId = ev.rows[0].id as string

    for (const t of SAMPLE_TICKETS) {
      await client.query(
        `INSERT INTO ticket_types
           (event_id, name, description, benefits, price_paise, quantity_total, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, false, $7)`,
        [eventId, t.name, t.description, t.benefits, t.price, t.total, t.sort],
      )
    }

    await client.query('COMMIT')
    console.log(`Sample data created: 1 event, ${SAMPLE_TICKETS.length} ticket types (inactive).`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  }
}

main()
  .catch((err) => {
    console.error('Seed failed:', err instanceof Error ? err.message : err)
    process.exitCode = 1
  })
  .finally(() => client.end())