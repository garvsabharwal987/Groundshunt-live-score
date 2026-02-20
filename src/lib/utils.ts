import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} at ${formatTime(time)}`;
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInMs = target.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 0 && diffInDays < 7) return `In ${diffInDays} days`;
  if (diffInDays < 0 && diffInDays > -7) return `${Math.abs(diffInDays)} days ago`;
  
  return formatDate(date);
}

export function getSportColor(sportSlug: string): string {
  const colors: Record<string, string> = {
    tabletennis: 'bg-tabletennis',
    football: 'bg-football',
    basketball: 'bg-basketball',
    badminton: 'bg-badminton',
    volleyball: 'bg-volleyball',
  };
  return colors[sportSlug] || 'bg-primary-500';
}

// Helper function to extract base sport name from slug (e.g., 'table-tennis-boys' -> 'tabletennis')
export function getBaseSportSlug(slug: string): string {
  // Remove gender suffixes like -boys, -girls, -men, -women
  // Also remove match type suffixes like -singles, -doubles
  // Then remove all hyphens to match SPORTS_CONFIG keys
  return slug.replace(/-(boys|girls|men|women|singles|doubles)/gi, '').replace(/-/g, '');
}

export function getSportColorClasses(sportSlug: string): {
  bg: string;
  text: string;
  border: string;
} {
  const baseSportSlug = getBaseSportSlug(sportSlug);
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    tabletennis: {
      bg: 'bg-tabletennis/10',
      text: 'text-tabletennis',
      border: 'border-tabletennis',
    },
    football: {
      bg: 'bg-football/10',
      text: 'text-football',
      border: 'border-football',
    },
    basketball: {
      bg: 'bg-basketball/10',
      text: 'text-basketball',
      border: 'border-basketball',
    },
    badminton: {
      bg: 'bg-badminton/10',
      text: 'text-badminton',
      border: 'border-badminton',
    },
    volleyball: {
      bg: 'bg-volleyball/10',
      text: 'text-volleyball',
      border: 'border-volleyball',
    },
    chess: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-800',
    },
    cricket: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-700',
    },
    tennis: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-700',
    },
    squash: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-700',
    },
    poolsnooker: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      border: 'border-indigo-700',
    },
  };
  return colors[baseSportSlug] || { bg: 'bg-primary-100', text: 'text-primary-600', border: 'border-primary-500' };
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    live: 'bg-red-500',
    upcoming: 'bg-blue-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-yellow-500',
    postponed: 'bg-orange-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getStatusBadgeClasses(status: string): string {
  const classes: Record<string, string> = {
    live: 'bg-red-100 text-red-700 border-red-200',
    upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-gray-100 text-gray-700 border-gray-200',
    cancelled: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    postponed: 'bg-orange-100 text-orange-700 border-orange-200',
  };
  return classes[status] || 'bg-gray-100 text-gray-700 border-gray-200';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
