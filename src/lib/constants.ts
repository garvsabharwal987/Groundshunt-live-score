// App-wide constants
export const APP_NAME = 'Groundshunt Arena';
export const APP_DESCRIPTION = 'Multi-sport live scoring and tournament tracking platform';

// Admin secret path (should match env variable)
export const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'arena-admin';

// Polling intervals (in milliseconds)
export const LIVE_SCORE_POLL_INTERVAL = 3000; // 3 seconds for live scores
export const FIXTURE_POLL_INTERVAL = 30000; // 30 seconds for fixture updates

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Sports configuration
export const SPORTS_CONFIG = {
  tabletennis: {
    name: 'Table Tennis',
    icon: 'Zap',
    color: '#f59e0b',
    scoreFields: ['set1', 'set2', 'set3', 'sets_won'],
    displayFormat: (score: { sets_won?: number }) => 
      `${score.sets_won || 0} sets`,
  },
  football: {
    name: 'Football',
    icon: 'Circle',
    color: '#2563eb',
    scoreFields: ['goals'],
    displayFormat: (score: { goals?: number }) => `${score.goals || 0}`,
  },
  basketball: {
    name: 'Basketball',
    icon: 'Circle',
    color: '#ea580c',
    scoreFields: ['q1', 'q2', 'q3', 'q4', 'total'],
    displayFormat: (score: { total?: number }) => `${score.total || 0}`,
  },
  badminton: {
    name: 'Badminton',
    icon: 'Feather',
    color: '#7c3aed',
    scoreFields: ['set1', 'set2', 'set3', 'sets_won'],
    displayFormat: (score: { sets_won?: number }) => `${score.sets_won || 0} sets`,
  },
  volleyball: {
    name: 'Volleyball',
    icon: 'Circle',
    color: '#dc2626',
    scoreFields: ['set1', 'set2', 'set3', 'set4', 'set5', 'sets_won'],
    displayFormat: (score: { sets_won?: number }) => `${score.sets_won || 0} sets`,
  },
} as const;

// Match statuses
export const MATCH_STATUSES = [
  { value: 'upcoming', label: 'Upcoming', color: 'blue' },
  { value: 'live', label: 'Live', color: 'red' },
  { value: 'completed', label: 'Completed', color: 'gray' },
  { value: 'cancelled', label: 'Cancelled', color: 'yellow' },
  { value: 'postponed', label: 'Postponed', color: 'orange' },
] as const;

// User roles
export const USER_ROLES = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'moderator', label: 'Moderator', description: 'Can manage matches and scores' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access to admin panel' },
] as const;

// Navigation items for user portal
export const USER_NAV_ITEMS = [
  { href: '/', label: 'Home', icon: 'Home' },
  { href: '/live', label: 'Live Scores', icon: 'Radio' },
  { href: '/fixtures', label: 'Fixtures', icon: 'Calendar' },
  { href: '/standings', label: 'Standings', icon: 'Trophy' },
  { href: '/news', label: 'News', icon: 'Newspaper' },
] as const;

// Navigation items for admin portal
export const ADMIN_NAV_ITEMS = [
  { href: '', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/fixtures', label: 'Fixtures', icon: 'Calendar' },
  { href: '/live-scoring', label: 'Live Scoring', icon: 'Radio' },
  { href: '/teams', label: 'Teams', icon: 'Users' },
  { href: '/sports', label: 'Sports', icon: 'Trophy' },
  { href: '/standings', label: 'Standings', icon: 'Medal' },
  { href: '/news', label: 'News', icon: 'Newspaper' },
  { href: '/audit-logs', label: 'Audit Logs', icon: 'FileText' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
] as const;
