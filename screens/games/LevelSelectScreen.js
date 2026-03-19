import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { ThemeContext } from '../../utils/ThemeContext';
import { getGameMode } from '../../utils/gameModes';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const GRID_SIZES = [
  { label: '4 × 4', value: 2, desc: 'Quick game (~2 min)' },
  { label: '9 × 9', value: 3, desc: 'Standard game' },
  { label: '16 × 16', value: 4, desc: 'Expert challenge' },
];

const DIFFICULTIES = [
  { label: 'Easy', value: -1, icon: '⭐', color: '#10B981' },
  { label: 'Medium', value: 0, icon: '⭐⭐', color: '#F59E0B' },
  { label: 'Hard', value: 1, icon: '⭐⭐⭐', color: '#EF4444' },
];

const LevelSelectScreen = ({ navigation, route }) => {
  const { gameModeId, gameRoute } = route.params;
  const { theme, hapticsEnabled } = useContext(ThemeContext);
  const [step, setStep] = useState(1);
  const [gridSize, setGridSize] = useState(null);
  const gameMode = getGameMode(gameModeId);

  const haptic = () => {
    if (hapticsEnabled) ReactNativeHapticFeedback.trigger('impactLight');
  };

  const selectGridSize = (size) => {
    haptic();
    setGridSize(size);
    setStep(2);
  };

  const selectDifficulty = (diff) => {
    haptic();
    navigation.navigate(gameRoute, { gameModeId, gridSize, diff });
  };

  const goBack = () => {
    haptic();
    setStep(1);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <Text style={styles.modeIcon}>{gameMode.icon}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{gameMode.name}</Text>
      <Text style={[styles.subtitle, { color: theme.subText }]}>
        {step === 1 ? 'Choose grid size' : 'Choose difficulty'}
      </Text>

      {step === 1 ? (
        <View style={styles.optionsContainer}>
          {GRID_SIZES.map(({ label, value, desc }) => (
            <TouchableOpacity
              key={value}
              style={[styles.optionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => selectGridSize(value)}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionLabel, { color: theme.text }]}>{label}</Text>
              <Text style={[styles.optionDesc, { color: theme.subText }]}>{desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <>
          <View style={styles.optionsContainer}>
            {DIFFICULTIES.filter(d => !(d.value === 1 && gridSize === 2)).map(({ label, value, icon, color }) => (
              <TouchableOpacity
                key={value}
                style={[styles.optionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => selectDifficulty(value)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionIcon}>{icon}</Text>
                <Text style={[styles.optionLabel, { color }]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={goBack} style={styles.backLink}>
            <Text style={[styles.backLinkText, { color: theme.primary }]}>← Change grid size</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  modeIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 36,
  },
  optionsContainer: {
    width: '100%',
    gap: 14,
  },
  optionCard: {
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  backLink: {
    marginTop: 28,
    padding: 10,
  },
  backLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LevelSelectScreen;
