// ============================================================
// EDIT ME: the main place for community details.
// Anything in [square brackets] is a placeholder to replace.
// An empty list [] or empty text '' makes the page show a
// friendly "coming soon" message instead.
// ============================================================

export const SITE = {
  name: 'Weebs of Krishnachura',
  shortName: 'WoK',
  // PLACEHOLDER tagline: change it whenever you like
  tagline: 'Where anime meets K-pop, under the flame-red blooms.',
  headline: 'A home for every fan, cosplayer, artist and gamer.',
  intro:
    'Weebs of Krishnachura is a community of anime lovers, K-pop fans, cosplayers, artists and pop-culture enthusiasts. [Placeholder: replace with your own community description.]',
}

export const EVENT = {
  name: '[Event name: to be announced]',
  // When the date is confirmed, put it here in this exact format:
  // '2026-12-20T10:00:00+05:30'   (date, time, India time zone)
  // While it is null, the site shows "date to be announced".
  date: null as string | null,
  venue: '[Venue: to be announced]',
  city: '[City: to be announced]',
  // Short description shown on the Events page
  description:
    '[Placeholder: describe the event here once details are finalised.]',
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/magazine', label: 'Magazine' },
  { to: '/community', label: 'Community' },
  { to: '/contact', label: 'Contact & FAQ' },
]

// Leave url empty ('') until you have the real link.
export const SOCIALS = [
  { name: 'Instagram', url: '' },
  { name: 'Discord', url: '' },
  { name: 'YouTube', url: '' },
]

// PLACEHOLDER descriptions: edit to match what your community really does.
export const ACTIVITIES = [
  { icon: '🎭', title: 'Cosplay', text: 'Showcase your craft and meet fellow cosplayers.' },
  { icon: '💃', title: 'K-pop Dance Covers', text: 'Perform or cheer on dance cover groups.' },
  { icon: '🎨', title: 'Fan Art', text: 'Share original art inspired by the things you love.' },
  { icon: '🎮', title: 'Gaming Corner', text: 'Friendly games and tournaments for all levels.' },
  { icon: '📺', title: 'Anime Talks', text: 'Discussions, recommendations and watch-alongs.' },
  { icon: '🤝', title: 'Meetups', text: 'Real-life hangouts to turn online friends into real ones.' },
]

// PLACEHOLDER magazine teasers: replaced by real articles in Stage 10.
export const MAGAZINE_PREVIEW = [
  { tag: 'Anime', title: '[Sample article title one]', byline: 'By [Author name]' },
  { tag: 'K-pop', title: '[Sample article title two]', byline: 'By [Author name]' },
  { tag: 'Cosplay', title: '[Sample article title three]', byline: 'By [Author name]' },
]

// ------------------------------------------------------------
// ABOUT PAGE
// ------------------------------------------------------------
export const ABOUT = {
  story:
    '[Placeholder: write your real community story here: when it started, who started it, and why.]',
  mission:
    '[Placeholder: write your real mission here, for example: to give anime and K-pop fans a friendly place to meet, create and celebrate together.]',
  whoWeBring: [
    'Anime lovers',
    'K-pop fans',
    'Cosplayers',
    'Artists and creators',
    'Gamers',
    'Other pop-culture enthusiasts',
  ],
  // Add real past events here. Example of one entry:
  // { title: 'Meetup 2025', date: 'March 2025', text: 'What happened.' }
  pastEvents: [] as { title: string; date: string; text: string }[],
  // Add real team members here. Example of one entry:
  // { name: 'Real Name', role: 'Founder' }
  team: [
    { name: '[Team member name]', role: '[Role]' },
    { name: '[Team member name]', role: '[Role]' },
    { name: '[Team member name]', role: '[Role]' },
  ],
  // PLACEHOLDER guidelines: replace with your community's real rules.
  guidelines: [
    '[Placeholder] Be respectful to every member.',
    '[Placeholder] No harassment, hate speech or discrimination.',
    '[Placeholder] Credit artists and creators; share only work you have the right to share.',
    '[Placeholder] Respect cosplay consent: always ask before taking photos.',
  ],
  joinWays: [
    { title: 'Become a member', text: 'Fill in the join form on the Community page.' },
    { title: 'Volunteer', text: '[Placeholder: describe how people can help at events.]' },
    { title: 'Perform or compete', text: '[Placeholder: describe how to join competitions.]' },
  ],
}

// ------------------------------------------------------------
// EVENTS PAGE
// ------------------------------------------------------------
// Planned activity TYPES (not confirmed competitions or schedules).
export const EVENT_ACTIVITY_TYPES = [
  'Cosplay competition',
  'K-pop dance covers',
  'Fan activities',
  'Games',
  'Community meetups',
]

// Add confirmed schedule items here. Example of one entry:
// { time: '10:00 AM', title: 'Doors open' }
export const EVENT_SCHEDULE = [] as { time: string; title: string }[]

// Add confirmed guests and performers here. Example of one entry:
// { name: 'Guest Name', role: 'Performer' }
export const EVENT_GUESTS = [] as { name: string; role: string }[]

// ------------------------------------------------------------
// COMMUNITY PAGE
// ------------------------------------------------------------
// Add real meetups here. Example of one entry:
// { title: 'Monthly meetup', when: 'First Sunday', where: 'Venue name' }
export const MEETUPS = [] as { title: string; when: string; where: string }[]

// Gallery tiles are placeholders until you have real, authorised photos.
export const GALLERY_PLACEHOLDERS = 6

// ------------------------------------------------------------
// CONTACT & FAQ PAGE
// ------------------------------------------------------------
// Leave a value as '' until you have the real detail.
export const CONTACT = {
  email: '',
  phone: '',
  address: '',
  hours: '',
}

// PLACEHOLDER answers: replace them with your real information
// and policies. Do not publish a refund policy until it is decided.
export const FAQ = [
  {
    group: 'Event',
    q: 'When and where is the event?',
    a: '[Placeholder] The date and venue have not been announced yet. They will appear on the Events page.',
  },
  {
    group: 'Event',
    q: 'Who is allowed to attend?',
    a: '[Placeholder] Describe age rules and any entry requirements here.',
  },
  {
    group: 'Tickets',
    q: 'How do I buy a ticket?',
    a: '[Placeholder] Tickets will be sold on the Passes & Tickets page once sales open. After payment you will receive an email with your ticket and QR code.',
  },
  {
    group: 'Tickets',
    q: 'What is your refund and cancellation policy?',
    a: '[Placeholder] The refund and cancellation policy has not been decided yet. It will be published here before tickets go on sale.',
  },
  {
    group: 'Tickets',
    q: 'I lost my ticket. What can I do?',
    a: '[Placeholder] You will be able to look up your booking using your booking reference.',
  },
  {
    group: 'Accessibility',
    q: 'Is the venue accessible?',
    a: '[Placeholder] Accessibility information will be added once the venue is confirmed. Please contact us if you have specific needs.',
  },
  {
    group: 'Community',
    q: 'How do I join the community?',
    a: 'Use the join form on the Community page.',
  },
]