import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { ThemeContext } from '../utils/ThemeContext';
import { GAME_MODES, getGameMode } from '../utils/gameModes';
import { useFocusEffect } from '@react-navigation/native';
import ModeCarousel from '../components/ui/ModeCarousel';
import OptionStepper from '../components/ui/OptionStepper';
import GameButton from '../components/ui/GameButton';
import { getCustomGames } from '../utils/customGameStorage';
import { isDailyCompleted, getDailyStreak, getMonthlyCount, getLevelInfo, getStats } from '../utils/statsStorage';

const DIFFICULTIES = [
  { value: -1, label: 'Easy', helper: 'More starting clues', icon: '+' },
  { value: 0, label: 'Normal', helper: 'Balanced challenge', icon: '++' },
  { value: 1, label: 'Hard', helper: 'Fewer hints, more pressure', icon: '+++' },
];

const GRID_OPTIONS = [
  { value: 2, label: '4 x 4', helper: 'Quick round' },
  { value: 3, label: '9 x 9', helper: 'Classic board' },
  { value: 4, label: '16 x 16', helper: 'Long session' },
];

const clampGridSize = mode => {
  const allowed = GRID_OPTIONS.filter(option => option.value <= mode.maxGridSize);
  return allowed[allowed.length - 1]?.value ?? 3;
};

const HomeScreen = ({ navigation }) => {
  const { theme, hapticsEnabled, gamePreferences, saveGamePreferences } = useContext(ThemeContext);
  const [showSetup, setShowSetup] = useState(false);
  const [customGameModes, setCustomGameModes] = useState([]);
  const [dailyDone, setDailyDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [levelInfo, setLevelInfo] = useState(null);
  
  const allModes = useMemo(() => {
    // Map custom games into the GAME_MODES strictly expected format
    const customDynamic = customGameModes.map(cg => ({
      id: cg.id,
      name: cg.name,
      description: 'Custom Game Type',
      icon: '🎨',
      images: Object.fromEntries(
        Object.entries(cg.images || {}).map(([k, v]) => [k, { uri: v }])
      ),
      maxGridSize: 3, // Custom digit images are 1-9
      isCustom: true,
    }));
    return [...GAME_MODES, ...customDynamic];
  }, [customGameModes]);

  useFocusEffect(
    useCallback(() => {
      getCustomGames().then(setCustomGameModes);
      const today = new Date().toISOString().split('T')[0];
      isDailyCompleted(today).then(setDailyDone);
      getDailyStreak().then(setStreak);
      getMonthlyCount().then(setMonthlyCount);
      getStats().then(s => setLevelInfo(getLevelInfo(s.totalScore)));
    }, [])
  );

  const selectedMode = allModes.find(m => m.id === gamePreferences.gameModeId) || allModes[0];

  useEffect(() => {
    if (gamePreferences.gridSize > selectedMode.maxGridSize) {
      saveGamePreferences({ gridSize: clampGridSize(selectedMode) });
    }
  }, [gamePreferences.gridSize, saveGamePreferences, selectedMode]);

  const availableGridOptions = useMemo(
    () => GRID_OPTIONS.filter(option => option.value <= selectedMode.maxGridSize),
    [selectedMode.maxGridSize],
  );

  const difficultyIndex = DIFFICULTIES.findIndex(item => item.value === gamePreferences.diff);
  const gridIndex = availableGridOptions.findIndex(item => item.value === gamePreferences.gridSize);
  const currentDifficulty = DIFFICULTIES[Math.max(difficultyIndex, 0)];
  const currentGrid = availableGridOptions[Math.max(gridIndex, 0)] ?? GRID_OPTIONS[1];

  const haptic = type => {
    if (hapticsEnabled) {
      ReactNativeHapticFeedback.trigger(type || 'impactLight');
    }
  };

  const changeMode = modeId => {
    const mode = allModes.find(m => m.id === modeId) || allModes[0];
    haptic();
    saveGamePreferences({
      gameModeId: modeId,
      gridSize: Math.min(gamePreferences.gridSize, clampGridSize(mode)),
    });
  };

  const changeDifficulty = direction => {
    const nextIndex = Math.min(Math.max(difficultyIndex + direction, 0), DIFFICULTIES.length - 1);
    haptic();
    saveGamePreferences({ diff: DIFFICULTIES[nextIndex].value });
  };

  const changeGrid = direction => {
    const nextIndex = Math.min(Math.max(gridIndex + direction, 0), availableGridOptions.length - 1);
    haptic();
    saveGamePreferences({ gridSize: availableGridOptions[nextIndex].value });
  };

  const startGame = async () => {
    haptic('notificationSuccess');
    await analytics().logEvent('game_start', {
      mode: gamePreferences.gameModeId,
      grid_size: gamePreferences.gridSize,
      difficulty: gamePreferences.diff,
    });

    navigation.navigate('Game', {
      gameModeId: gamePreferences.gameModeId,
      gridSize: gamePreferences.gridSize,
      diff: gamePreferences.diff,
    });
  };

  const startDaily = async () => {
    haptic('notificationSuccess');
    if (dailyDone) {
      // Maybe show a message or just let them play again
    }
    await analytics().logEvent('daily_challenge_start');
    navigation.navigate('Game', {
      gameModeId: 'classic',
      gridSize: 3,
      diff: 0,
      isDaily: true
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <ScrollView
        contentContainerStyle={[styles.content, showSetup ? styles.contentSetup : styles.contentCentered]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerWrap}>
          <View style={styles.hero}>
            {levelInfo && (
              <View style={styles.levelBadge}>
                <View style={[styles.levelProgress, { width: `${levelInfo.progress * 100}%`, backgroundColor: theme.primary }]} />
                <Text style={[styles.levelText, { color: theme.text }]}>Lvl {levelInfo.level}</Text>
              </View>
            )}
            <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.title, { color: theme.text }]}>Sudoku X Quadoku</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>by Andrew Bro</Text>
          </View>

          {!showSetup ? (
            <View style={styles.topButtons}>
              <GameButton
                title="Start To Play"
                icon="▶"
                onPress={() => {
                  haptic();
                  setShowSetup(true);
                }}
                style={styles.topButton}
              />
              <GameButton
                title={dailyDone ? "Daily Completed" : "Daily Challenge"}
                subtitle={`${streak} Day Streak · ${monthlyCount} this month`}
                icon="📅"
                variant={dailyDone ? "secondary" : "accent"}
                onPress={() => {
                  haptic();
                  startDaily();
                }}
                disabled={dailyDone}
                style={styles.topButton}
              />
              <GameButton
                title="Statistics"
                icon="📊"
                variant="secondary"
                onPress={() => {
                  haptic();
                  navigation.navigate('Stats');
                }}
                style={styles.topButton}
              />
              <GameButton
                title="Create your game"
                icon="🎨"
                variant="secondary"
                onPress={() => {
                  haptic();
                  navigation.navigate('CustomGame');
                }}
                style={styles.topButton}
              />
              <GameButton
                title="Settings"
                icon="⚙"
                variant="secondary"
                onPress={() => {
                  haptic();
                  navigation.navigate('Settings');
                }}
                style={styles.topButton}
              />
            </View>
          ) : (
            <View style={styles.setupWrap}>
              <ModeCarousel
                modes={allModes}
                selectedModeId={gamePreferences.gameModeId}
                onSelect={changeMode}
              />

              <OptionStepper
                label="Difficulty"
                valueLabel={`${currentDifficulty.icon} ${currentDifficulty.label}`}
                helper={currentDifficulty.helper}
                onDecrease={() => changeDifficulty(-1)}
                onIncrease={() => changeDifficulty(1)}
                leftDisabled={difficultyIndex <= 0}
                rightDisabled={difficultyIndex >= DIFFICULTIES.length - 1}
              />

              <OptionStepper
                label="Grid Size"
                valueLabel={currentGrid.label}
                helper={currentGrid.helper}
                onDecrease={() => changeGrid(-1)}
                onIncrease={() => changeGrid(1)}
                leftDisabled={gridIndex <= 0}
                rightDisabled={gridIndex >= availableGridOptions.length - 1}
              />

              <GameButton
                title="Play Now"
                icon="▶"
                onPress={startGame}
                style={styles.topButton}
              />

              <GameButton
                title="Back"
                variant="secondary"
                onPress={() => {
                  haptic();
                  setShowSetup(false);
                }}
                style={styles.topButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    minHeight: '100%',
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 30,
  },
  contentCentered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentSetup: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerWrap: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  bgOrbTop: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    top: -60,
    right: -30,
    opacity: 0.45,
  },
  bgOrbBottom: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: -80,
    left: -60,
    opacity: 0.4,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 150,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  topButtons: {
    gap: 10,
    width: '100%',
  },
  setupWrap: {
    gap: 14,
    width: '100%',
  },
  topButton: {
    width: '100%',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 158, 44, 0.3)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  levelProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    opacity: 0.2,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
