export const ITEMS_PER_PAGE = {
  TASKS: 15,
  GMAIL: 20,
} as const;

export const ANIMATION = {
  SPINNER_CLASS: "h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white",
  FADE_IN      : "animate-fade-in",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  MIN_PAGE    : 1,
} as const;
