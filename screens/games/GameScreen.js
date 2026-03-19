import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Sudoku from '../../components/Sudoku';
import { ThemeContext } from '../../utils/ThemeContext';

const GameScreen = () => {
  const route = useRoute();
  const { theme } = useContext(ThemeContext);
  const { gameModeId = 'classic', gridSize = 3, diff = 0, isDaily = false } = route.params ?? {};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Sudoku gridSize={gridSize} diff={diff} game={gameModeId} isDaily={isDaily} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GameScreen;
