import React, { createContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const lightTheme = {
  mode: 'light',
  background: '#FFF4D8',
  backgroundSecondary: '#FFDDB0',
  card: '#FFF9EE',
  cardAlt: '#FFEBCB',
  text: '#3E2414',
  subText: '#8E5F3B',
  primary: '#FF9E2C',
  primaryDark: '#D96C08',
  primarySoft: '#FFD173',
  accent: '#FF6B6B',
  accentSoft: '#FFC9B3',
  secondary: '#59C3C3',
  secondarySoft: '#C5F2EC',
  border: '#F3C892',
  borderStrong: '#C97B24',
  gridBackground: '#FFF7EC',
  cellBackground: '#FFFDF8',
  generatedCellBackground: '#FFE7C2',
  highlightBackground: '#FFF1CF',
  selectedBorder: '#FF8A00',
  shadow: '#A04A00',
  textureTint: 'rgba(255,255,255,0.28)',
  overlay: 'rgba(66,31,11,0.40)',
  danger: '#E85D44',
  errorBackground: '#FFE0D5',
  errorText: '#C2410C',
  successBackground: '#DCFCE7',
  successText: '#0F9D58',
  modalBackdrop: 'rgba(63, 29, 8, 0.52)',
};

export const darkTheme = {
  mode: 'dark',
  background: '#2B1630',
  backgroundSecondary: '#462255',
  card: '#4E2C63',
  cardAlt: '#5D3874',
  text: '#FFF6E9',
  subText: '#E5C7AD',
  primary: '#FFB62E',
  primaryDark: '#FF8906',
  primarySoft: '#FFD978',
  accent: '#FF7E8C',
  accentSoft: '#743A6A',
  secondary: '#6BE0D4',
  secondarySoft: '#315E72',
  border: '#7C4B86',
  borderStrong: '#FFCE73',
  gridBackground: '#3A1F49',
  cellBackground: '#4C2B63',
  generatedCellBackground: '#362044',
  highlightBackground: '#5C3675',
  selectedBorder: '#FFD15C',
  shadow: '#140817',
  textureTint: 'rgba(255,255,255,0.12)',
  overlay: 'rgba(10,5,16,0.42)',
  danger: '#FF7A59',
  errorBackground: '#5E2732',
  errorText: '#FFD0CC',
  successBackground: '#214E45',
  successText: '#92F2B8',
  modalBackdrop: 'rgba(7, 4, 10, 0.64)',
};

export const ThemeProvider = ({ children }) => {
  const scheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(scheme === 'dark' ? 'dark' : 'light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [gamePreferences, setGamePreferences] = useState({
    gameModeId: 'classic',
    gridSize: 3,
    diff: 0,
  });

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const gradients = useMemo(() => ({
    primary: [theme.primary, theme.primaryDark],
    accent: [theme.accent, theme.primary],
    panel: [theme.card, theme.cardAlt],
  }), [theme]);

  const toggleTheme = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const saveGamePreferences = nextPrefs => {
    setGamePreferences(prev => ({
      ...prev,
      ...nextPrefs,
    }));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      gradients,
      toggleTheme,
      themeMode,
      soundEnabled,
      setSoundEnabled,
      hapticsEnabled,
      setHapticsEnabled,
      hintsEnabled,
      setHintsEnabled,
      gamePreferences,
      saveGamePreferences,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
