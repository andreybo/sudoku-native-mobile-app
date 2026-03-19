import React, { useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ThemeContext } from '../utils/ThemeContext';
import PanelCard from '../components/ui/PanelCard';
import { getStats, getWeeklyCompletion, getDailyStreak, getMonthlyCount } from '../utils/statsStorage';
import { GAME_MODES } from '../utils/gameModes';

const StatBox = ({ label, value, theme, tone = 'default' }) => (
  <View style={[styles.statBox, { backgroundColor: theme.cardAlt, borderColor: theme.borderStrong }]}>
    <Text style={[styles.statValue, { color: tone === 'accent' ? theme.primary : theme.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: theme.subText }]}>{label}</Text>
  </View>
);

const DailyGoalCircle = ({ day, completed, theme }) => (
  <View style={styles.goalDayWrap}>
    <View style={[
      styles.goalCircle, 
      { 
        backgroundColor: completed ? theme.primary : theme.cardAlt,
        borderColor: completed ? theme.primary : theme.border
      }
    ]}>
      {completed && <Text style={styles.goalCheck}>✓</Text>}
    </View>
    <Text style={[styles.goalDayName, { color: theme.subText }]}>{day}</Text>
  </View>
);

const StatsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [streak, setStreak] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [levelInfo, setLevelInfo] = useState(null);

  useEffect(() => {
    getStats().then(s => {
      setStats(s);
      setLevelInfo(getLevelInfo(s.totalScore));
    });
    getWeeklyCompletion().then(setWeekly);
    getDailyStreak().then(setStreak);
    getMonthlyCount().then(setMonthlyCount);
  }, []);

  if (!stats) return null;

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalWinRate = stats.totalPlayed > 0 
    ? Math.round((stats.totalWon / stats.totalPlayed) * 100) 
    : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <Text style={[styles.pageTitle, { color: theme.text }]}>Statistics</Text>
      <Text style={[styles.pageSubtitle, { color: theme.subText }]}>Track your progress and best performances.</Text>

      {levelInfo && (
        <PanelCard tone="accent">
          <View style={styles.levelHeader}>
            <View style={styles.levelMain}>
               <Text style={[styles.levelBig, { color: theme.text }]}>Level {levelInfo.level}</Text>
               <Text style={[styles.xpText, { color: theme.subText }]}>{levelInfo.totalScore} Total XP</Text>
            </View>
            <Text style={[styles.levelPercent, { color: theme.primaryDark }]}>{Math.round(levelInfo.progress * 100)}%</Text>
          </View>
          <View style={[styles.fullProgressBar, { backgroundColor: theme.cardAlt }]}>
            <View style={[styles.fullProgressFill, { width: `${levelInfo.progress * 100}%`, backgroundColor: theme.primary }]} />
          </View>
          <View style={styles.xpLabels}>
            <Text style={[styles.xpLabel, { color: theme.subText }]}>{levelInfo.currentLevelXP} XP</Text>
            <Text style={[styles.xpLabel, { color: theme.subText }]}>{levelInfo.nextLevelXP} XP</Text>
          </View>
        </PanelCard>
      )}

      <View style={[styles.summaryRow, { flexWrap: 'wrap' }]}>
        <View style={{ width: '31%' }}><StatBox label="Played" value={stats.totalPlayed} theme={theme} /></View>
        <View style={{ width: '31%' }}><StatBox label="Wins" value={stats.totalWon} theme={theme} /></View>
        <View style={{ width: '31%' }}><StatBox label="Uncompleted" value={Math.max(0, stats.totalPlayed - stats.totalWon)} theme={theme} /></View>
        <View style={{ width: '48%' }}><StatBox label="Win Rate" value={`${totalWinRate}%`} theme={theme} /></View>
        <View style={{ width: '48%' }}><StatBox label="Total XP" value={stats.totalScore || 0} theme={theme} tone="accent" /></View>
      </View>

      <PanelCard tone="accent">
        <Text style={[styles.sectionTitle, { color: theme.subText, marginBottom: 12 }]}>Daily Challenges</Text>
        <View style={styles.dailyHeader}>
            <View>
                <Text style={[styles.streakValue, { color: theme.text }]}>{streak} Days</Text>
                <Text style={[styles.streakLabel, { color: theme.subText }]}>Current Streak</Text>
            </View>
            <View style={styles.monthlyBadge}>
                <Text style={[styles.monthlyValue, { color: theme.primaryDark }]}>{monthlyCount}</Text>
                <Text style={[styles.monthlyLabel, { color: theme.primaryDark }]}>This Month</Text>
            </View>
        </View>

        <View style={styles.weeklyRow}>
            {weekly.map((day, idx) => (
                <DailyGoalCircle key={idx} day={day.dayName} completed={day.completed} theme={theme} />
            ))}
        </View>
      </PanelCard>

      {GAME_MODES.map(mode => {
        const modeStats = stats.modes[mode.id];
        if (!modeStats) return null;

        return (
          <PanelCard key={mode.id} tone="default">
            <View style={styles.modeHeader}>
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <Text style={[styles.modeName, { color: theme.text }]}>{mode.name}</Text>
            </View>
            
            {Object.entries(modeStats).map(([diff, s]) => {
                const diffLabel = diff === '-1' ? 'Easy' : diff === '1' ? 'Hard' : 'Normal';
                return (
                    <View key={diff} style={styles.diffSection}>
                        <Text style={[styles.diffTitle, { color: theme.primary }]}>{diffLabel}</Text>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: theme.subText }]}>Uncompleted</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>{Math.max(0, s.totalPlayed - s.totalWon)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: theme.subText }]}>Best Time</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>{formatTime(s.bestTime)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: theme.subText }]}>Avg Time</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>{formatTime(Math.round(s.totalTime / (s.totalWon || 1)))}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: theme.subText }]}>Best Score</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>{s.bestScore}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: theme.subText }]}>Avg Score</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>{Math.round(s.totalScore / (s.totalWon || 1))}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
          </PanelCard>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
  },
  pageSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  modeIcon: {
    fontSize: 24,
  },
  modeName: {
    fontSize: 20,
    fontWeight: '900',
  },
  diffSection: {
    marginBottom: 16,
  },
  diffTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  monthlyBadge: {
    backgroundColor: 'rgba(255, 158, 44, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
  },
  monthlyValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  monthlyLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  goalDayWrap: {
    alignItems: 'center',
    gap: 6,
  },
  goalCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheck: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  goalDayName: {
    fontSize: 11,
    fontWeight: '800',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  levelMain: {
    gap: 2,
  },
  levelBig: {
    fontSize: 32,
    fontWeight: '900',
  },
  xpText: {
    fontSize: 14,
    fontWeight: '700',
  },
  levelPercent: {
    fontSize: 20,
    fontWeight: '900',
  },
  fullProgressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 6,
  },
  fullProgressFill: {
    height: '100%',
    borderRadius: 6,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  xpLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

export default StatsScreen;
