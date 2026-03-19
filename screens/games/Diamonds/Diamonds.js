import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getGameMode } from '../../../utils/gameModes';

const MAX_GRID_SIZE = getGameMode('diamonds').maxGridSize ?? 3;

const Diamonds = ({ navigation }) => {
  const [step, setStep] = useState(1); // Step 1 for grid size, Step 2 for difficulty
  const [gridSize, setGridSize] = useState(null);


  const [isLoading, setIsLoading] = useState(false);



  const selectGridSize = (size) => {
    setGridSize(size);
    setStep(2); // Move to next step after selecting grid size
  };

  const selectDifficulty = (diff) => {
    setIsLoading(true); // Start loading animation


    // Simulate a delay or fetch data, then navigate
    setTimeout(() => {
      navigation.navigate('Diamonds game', { gridSize, diff });
      setIsLoading(false); // Stop loading animation
    }, 2000); // Adjust the delay as needed
  };

  const renderDifficultyButtons = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.button}
          onPress={() => selectDifficulty(-1)}
        >
            <Text style={styles.buttonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => selectDifficulty(0)}
        >
            <Text style={styles.buttonText}>Medium</Text>
        </TouchableOpacity>
        {gridSize !== 2 &&
          <TouchableOpacity
            style={styles.button}
            onPress={() => selectDifficulty(1)}
          >
              <Text style={styles.buttonText}>Hard</Text>
          </TouchableOpacity>
        }
      </>
    );
  };

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4EABF4" /> // Customize size and color as needed
      ) : (
        <>
        {step === 1 && (
          <>
            <Text style={styles.title}>Select Grid Size:</Text>
            {Array.from({ length: MAX_GRID_SIZE - 1 }, (_, i) => i + 2).map(size => (
              <TouchableOpacity
                key={size}
                style={styles.button}
                onPress={() => selectGridSize(size)}
              >
                <Text style={styles.buttonText}>{size}x{size} Grid</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Select Difficulty:</Text>
            {renderDifficultyButtons()}
          </>
        )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title:{
    fontSize: 20,
    marginBottom: 20,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#4EABF4',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    width: 200,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default Diamonds;
