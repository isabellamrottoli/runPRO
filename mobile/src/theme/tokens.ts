export const colors = {
  brandPrimary: '#4F56D3',
  brandPrimaryDark: '#3A3FA0',
  brandAccent: '#FF712D',
  brandAccentDark: '#E5601F',

  bgBase: '#0D0F1A',
  bgSurface: '#1A1D2E',
  bgSurfaceLight: '#252840',

  textPrimary: '#F1F2F9',
  textSecondary: '#8B8FA3',
  textDisabled: '#4A4D5E',

  statusSuccess: '#22C55E',
  statusError: '#EF4444',
  statusPending: '#8B8FA3',
  statusWarning: '#FACC15',
  statusBarEmpty: '#252840',

  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  extraboldItalic: 'Inter_800ExtraBold_Italic',
  brand: 'MuseoModerno_800ExtraBold',
} as const;

export const typography = {
  headingXl: { fontSize: 28, fontFamily: fonts.bold },
  headingLg: { fontSize: 22, fontFamily: fonts.semibold },
  headingMd: { fontSize: 18, fontFamily: fonts.semibold },
  body: { fontSize: 16, fontFamily: fonts.regular },
  bodySm: { fontSize: 14, fontFamily: fonts.regular },
  caption: { fontSize: 12, fontFamily: fonts.regular },
} as const;
