import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Sudoku from '../../../components/Sudoku';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../../../utils/ThemeContext';

const DiamondsGameScreen = () => {
  const route = useRoute();
  const { theme } = useContext(ThemeContext);
  const { gridSize = 3, diff = 0, isDaily = false } = route.params ?? {};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Sudoku gridSize={gridSize} diff={diff} game="diamonds" isDaily={isDaily}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default DiamondsGameScreen;
