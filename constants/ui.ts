export const UI = {
  BORDER_RADIUS: {
    SM: "rounded-xl",
    MD: "rounded-2xl",
    LG: "rounded-3xl",
  },
  TRANSITION: {
    DEFAULT: "transition",
    SLOW   : "transition-all duration-300",
  },
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
  },
} as const;

export const COMPONENT_SIZES = {
  ICON: {
    SM: "h-4 w-4",
    MD: "h-5 w-5",
    LG: "h-7 w-7",
  },
  BUTTON: {
    SM: "px-3 py-1.5 text-xs",
    MD: "px-4 py-2 text-sm",
    LG: "px-5 py-2.5 text-sm",
  },
  INPUT: {
    HEIGHT : "py-3",
    PADDING: "pl-11 pr-4",
  },
} as const;
