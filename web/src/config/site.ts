// ============================================================
// EDIT ME: the main place for community details.
// Anything in [square brackets] is a placeholder to replace.
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