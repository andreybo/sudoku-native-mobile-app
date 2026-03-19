import React from 'react';
import { StyleSheet, View } from 'react-native';
import GameButton from './ui/GameButton';

const SubmitBoard = ({ onCheck, onClear, onReload }) => {
  return (
    <View style={styles.container}>
      <GameButton
        title="Clear"
        subtitle="Reset your moves"
        icon="⌫"
        onPress={onClear}
        variant="secondary"
        style={styles.action}
      />
      <GameButton
        title="New"
        subtitle="Fresh board"
        icon="↻"
        onPress={onReload}
        variant="accent"
        style={styles.action}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
    marginTop: 18,
  },
  action: {
    width: '100%',
  },
});

export default SubmitBoard;
