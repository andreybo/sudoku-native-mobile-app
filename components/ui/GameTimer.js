import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../../utils/ThemeContext';

export const formatElapsedTime = totalSeconds => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const GameTimer = ({ seconds, label = 'Time' }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.timer, { backgroundColor: theme.cardAlt, borderColor: theme.borderStrong }]}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{formatElapsedTime(seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timer: {
    minWidth: 108,
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '900',
  },
});

export default GameTimer;
