import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatElapsedTime } from '../ui/GameTimer';
import PanelCard from '../ui/PanelCard';

const SudokuHeader = ({
  theme,
  navigation,
  difficultyMeta,
  totalCells,
  seconds,
  progress,
  score,
}) => {
  const pct = Math.round(progress * 100);

  return (
    <PanelCard tone="accent" style={s.card}>
      {/* ── top row ──────────────────────────────────────────── */}
      <View style={s.row}>

        {/* back — chevron icon */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}
          style={[s.backBtn, { backgroundColor: theme.cardAlt, borderColor: theme.borderStrong }]}
        >
          <View style={[s.chevron, { borderColor: theme.text }]} />
        </TouchableOpacity>

        {/* difficulty + board-size chips */}
        <View style={s.chips}>
          <View style={[s.chip, { backgroundColor: theme.primarySoft }]}>
            <Text style={[s.chipText, { color: theme.primaryDark }]}>{difficultyMeta.label}</Text>
          </View>
          <View style={[s.chip, { backgroundColor: theme.secondarySoft }]}>
            <Text style={[s.chipText, { color: theme.secondary }]}>{totalCells}×{totalCells}</Text>
          </View>
        </View>

        {/* compact inline timer */}
        <View style={s.statsRow}>
            <View style={[s.statPill, { backgroundColor: theme.cardAlt, borderColor: theme.borderStrong }]}>
              <Text style={[s.statIcon, { color: theme.subText }]}>⏱</Text>
              <Text style={[s.statValue, { color: theme.text }]}>{formatElapsedTime(seconds)}</Text>
            </View>
            <View style={[s.statPill, { backgroundColor: theme.cardAlt, borderColor: theme.borderStrong }]}>
              <Text style={[s.statIcon, { color: theme.primary }]}>★</Text>
              <Text style={[s.statValue, { color: theme.text }]}>{score}</Text>
            </View>
        </View>
      </View>

      {/* ── progress bar ─────────────────────────────────────── */}
      <View style={s.progressRow}>
        <View style={[s.track, { backgroundColor: theme.cardAlt, borderColor: theme.borderStrong, flex: 1 }]}>
          <View
            style={[
              s.fill,
              { width: `${Math.max(3, pct)}%`, backgroundColor: theme.secondary },
            ]}
          />
        </View>
        <Text style={[s.pctText, { color: theme.subText }]}>{pct}%</Text>
      </View>
    </PanelCard>
  );
};

const s = StyleSheet.create({
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  /* back button */
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    transform: [{ rotate: '45deg' }],
    marginLeft: 3,
  },
  /* chips row */
  chips: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  /* stats container */
  statsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  /* stat pill (timer/score) */
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  statIcon: {
    fontSize: 13,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  /* progress */
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  track: {
    height: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  pctText: {
    fontSize: 11,
    fontWeight: '800',
    minWidth: 32,
    textAlign: 'right',
  },
});

export default SudokuHeader;
