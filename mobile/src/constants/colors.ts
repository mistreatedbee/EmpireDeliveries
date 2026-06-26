// Light-mode tokens mirroring the "Empire Components" design system
// (see /Empire Components/src/index.css `.light` block) — gold accents on
// warm paper/cream surfaces rather than the library's dark-glass default.
export const T = {
  bg:           '#FAFAF7',
  surface:      '#FFFFFF',
  surface2:     '#F4F2EB',
  border:       '#E7E4D9',
  text:         '#121212',
  textSec:      '#6B6B70',
  textTer:      '#A3A3A3',
  textOnDark:   '#FFFFFF',
  action:       '#0A0A0A',
  actionPressed:'#2B2B2B',
  gold:         '#D4AF37',
  goldBright:   '#E8C766',
  goldDeep:     '#A8842A',
  goldForeground: '#0A0A0A',
  goldBg:       '#FBF6E3',
  glass:        'rgba(255,255,255,0.7)',
  glassBorder:  'rgba(212,175,55,0.25)',
  success:      '#22C55E',
  successBg:    'rgba(34,197,94,0.15)',
  danger:       '#EF4444',
  dangerBg:     'rgba(239,68,68,0.15)',
  warning:      '#F59E0B',
  warningBg:    'rgba(245,158,11,0.15)',
  info:         '#3B82F6',
  infoBg:       'rgba(59,130,246,0.15)',
  dark:         '#0A0A0A',
  darkSurface:  '#1C1C1C',
} as const;

// Border radii mirroring --radius-sm/md/lg/full
export const Radius = {
  sm: 10,
  md: 16,
  lg: 24,
  full: 9999,
} as const;

// Font families — load via useFonts in app/_layout.tsx before use
export const Fonts = {
  heading: 'PlusJakartaSans_700Bold',
  headingExtra: 'PlusJakartaSans_800ExtraBold',
  headingSemibold: 'PlusJakartaSans_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

// RN approximations of --shadow-sm / --shadow-md / --glow-gold
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  glow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const Colors = {
  gold: {
    50: '#fdf9ec',
    100: '#f9efca',
    200: '#f3dd90',
    300: '#ecc84d',
    400: '#e4b528',
    500: '#D4AF37',
    600: '#b8911a',
    700: '#936e16',
    800: '#795818',
    900: '#67481a',
    950: '#3c270a',
  },
  empire: {
    black: '#0A0A0A',
    charcoal: '#1C1C1C',
    gold: '#D4AF37',
    white: '#FFFFFF',
    success: '#00C853',
    warning: '#FF9800',
    error: '#D32F2F',
  },
  surface: {
    100: '#F8F8F8',
    200: '#F0F0F0',
    300: '#E8E8E8',
    400: '#D0D0D0',
  },
} as const;

export type ColorKey = keyof typeof Colors;
