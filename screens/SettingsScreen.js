import React, { useContext } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { ThemeContext } from '../utils/ThemeContext';
import PanelCard from '../components/ui/PanelCard';

const SettingRow = ({ label, description, value, onToggle, theme }) => (
  <View style={[styles.row, { backgroundColor: theme.cardAlt, borderColor: theme.borderStrong }]}>
    <View style={styles.rowText}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.rowDesc, { color: theme.subText }]}>{description}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: theme.border, true: theme.primary }}
      thumbColor="#fff"
      ios_backgroundColor={theme.border}
    />
  </View>
);

const SettingsScreen = () => {
  const {
    theme,
    themeMode,
    toggleTheme,
    soundEnabled,
    setSoundEnabled,
    hapticsEnabled,
    setHapticsEnabled,
    hintsEnabled,
    setHintsEnabled,
  } = useContext(ThemeContext);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <PanelCard tone="accent">
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>Appearance</Text>
        <SettingRow
          label="Dark Mode"
          description={themeMode === 'dark' ? 'Night palette enabled' : 'Bright playful palette enabled'}
          value={themeMode === 'dark'}
          onToggle={toggleTheme}
          theme={theme}
        />
      </PanelCard>

      <PanelCard>
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>Feedback</Text>
        <SettingRow
          label="Sound Effects"
          description="Clicks, success and error sounds during play"
          value={soundEnabled}
          onToggle={setSoundEnabled}
          theme={theme}
        />
        <SettingRow
          label="Haptic Feedback"
          description="Vibration on taps and important game events"
          value={hapticsEnabled}
          onToggle={setHapticsEnabled}
          theme={theme}
        />
        <SettingRow
          label="Show Hints"
          description="Highlight invalid moves immediately"
          value={hintsEnabled}
          onToggle={setHintsEnabled}
          theme={theme}
        />
      </PanelCard>

      <PanelCard>
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>About</Text>
        <View style={[styles.aboutBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.aboutIcon}>🎯</Text>
        </View>
        <Text style={[styles.aboutName, { color: theme.text }]}>Sudoku Mix Quadoku</Text>
        <Text style={[styles.aboutMeta, { color: theme.subText }]}>Version 2.0.1</Text>
      </PanelCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 14,
    paddingBottom: 30,
  },
  topBlob: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    top: -80,
    right: -70,
    opacity: 0.45,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  rowDesc: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  aboutBadge: {
    width: 78,
    height: 78,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 6,
  },
  aboutIcon: {
    fontSize: 36,
  },
  aboutName: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
  },
  aboutMeta: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default SettingsScreen;
