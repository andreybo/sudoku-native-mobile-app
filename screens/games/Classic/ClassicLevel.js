import React, { useState } from 'react';
import { View, TouchableOpacity, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';


const ClassicLevel = ({ navigation }) => {
  const [step, setStep] = useState(1); // Step 1 for grid size, Step 2 for difficulty
  const [gridSize, setGridSize] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  


  const selectGridSize = (size) => {
    setGridSize(size);
    setStep(2); // Move to next step after selecting grid size
  };

  const selectDifficulty = (diff) => {
    setIsLoading(true); // Start loading animation
    setDifficulty(diff);
  
    // Simulate a delay or fetch data, then navigate
    setTimeout(() => {
      navigation.navigate('Classic game', { gridSize, diff });
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => selectGridSize(2)} 
            >
                <Text style={styles.buttonText}>2x2 Grid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => selectGridSize(3)} 
            >
                <Text style={styles.buttonText}>3x3 Grid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => selectGridSize(4)} 
            >
                <Text style={styles.buttonText}>4x4 Grid</Text>
            </TouchableOpacity>
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
    backgroundColor: "#fff",
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
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
  }
});

export default ClassicLevel;
