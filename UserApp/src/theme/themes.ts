export interface ThemeColors {
  primaryBg: string;
  secondaryBg: string;
  cardBg: string;
  cardBgLight: string;
  inputBg: string;
  accent: string;
  accentDark: string;
  accentGlow: string;
  accentSubtle: string;
  purple: string;
  purpleGlow: string;
  purpleSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  running: string;
  runningBg: string;
  arriving: string;
  arrivingBg: string;
  stopped: string;
  stoppedBg: string;
  border: string;
  borderLight: string;
  borderAccent: string;
  shadowColor: string;
  bottomNavBg: string;
  overlayBg: string;
  statusBarStyle: 'light-content' | 'dark-content';
  bottomSheetBg: string;
  handleColor: string;
}

export interface AppTheme {
  isDark: boolean;
  colors: ThemeColors;
}

export const darkTheme: AppTheme = {
  isDark: true,
  colors: {
    primaryBg: '#0B0F2E',
    secondaryBg: '#121640',
    cardBg: '#161B45',
    cardBgLight: '#1C2252',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    accent: '#00E5A0',
    accentDark: '#00B87D',
    accentGlow: 'rgba(0, 229, 160, 0.2)',
    accentSubtle: 'rgba(0, 229, 160, 0.08)',
    purple: '#6C5CE7',
    purpleGlow: 'rgba(108, 92, 231, 0.2)',
    purpleSubtle: 'rgba(108, 92, 231, 0.08)',
    textPrimary: '#FFFFFF',
    textSecondary: '#8A96C0',
    textMuted: '#4A5580',
    textAccent: '#00E5A0',
    running: '#00E676',
    runningBg: 'rgba(0, 230, 118, 0.12)',
    arriving: '#FFAB00',
    arrivingBg: 'rgba(255, 171, 0, 0.12)',
    stopped: '#FF5252',
    stoppedBg: 'rgba(255, 82, 82, 0.12)',
    border: 'rgba(255, 255, 255, 0.06)',
    borderLight: 'rgba(255, 255, 255, 0.10)',
    borderAccent: 'rgba(0, 229, 160, 0.3)',
    shadowColor: '#000000',
    bottomNavBg: '#0E1235',
    overlayBg: 'rgba(0, 0, 0, 0.6)',
    statusBarStyle: 'light-content',
    bottomSheetBg: '#161B45',
    handleColor: 'rgba(255, 255, 255, 0.2)',
  },
};

export const lightTheme: AppTheme = {
  isDark: false,
  colors: {
    primaryBg: '#F0F4F8',
    secondaryBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBgLight: '#F7F9FC',
    inputBg: 'rgba(0, 0, 0, 0.03)',
    accent: '#00C896',
    accentDark: '#00A67D',
    accentGlow: 'rgba(0, 200, 150, 0.15)',
    accentSubtle: 'rgba(0, 200, 150, 0.06)',
    purple: '#6C5CE7',
    purpleGlow: 'rgba(108, 92, 231, 0.12)',
    purpleSubtle: 'rgba(108, 92, 231, 0.06)',
    textPrimary: '#1A1D2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textAccent: '#00C896',
    running: '#10B981',
    runningBg: 'rgba(16, 185, 129, 0.10)',
    arriving: '#F59E0B',
    arrivingBg: 'rgba(245, 158, 11, 0.10)',
    stopped: '#EF4444',
    stoppedBg: 'rgba(239, 68, 68, 0.10)',
    border: 'rgba(0, 0, 0, 0.06)',
    borderLight: 'rgba(0, 0, 0, 0.08)',
    borderAccent: 'rgba(0, 200, 150, 0.25)',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    bottomNavBg: '#FFFFFF',
    overlayBg: 'rgba(0, 0, 0, 0.4)',
    statusBarStyle: 'dark-content',
    bottomSheetBg: '#FFFFFF',
    handleColor: 'rgba(0, 0, 0, 0.15)',
  },
};
