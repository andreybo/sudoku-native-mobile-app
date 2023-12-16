import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Sudoku from "../../../components/Sudoku"
import { useRoute } from '@react-navigation/native';

const EggsGameScreen = () => {
  const route = useRoute();
  const gridSize = route.params?.gridSize || 3;
  const diff = route.params?.diff || 0;
  
  return (
    <View style={styles.container}>
        <Sudoku gridSize={gridSize} diff={diff} game='eggs'/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default EggsGameScreen;