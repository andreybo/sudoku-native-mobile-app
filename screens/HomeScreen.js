import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Image source={require('../assets/logo.png')} style={styles.logo}/>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Classic level', { gridSize: 3, diff: 0 })}
      >
          <Text style={styles.buttonText}>Classic game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Eggs', { gridSize: 3, diff: 0 })}
      >
          <Text style={styles.buttonText}>Eggs</Text>
      </TouchableOpacity>
      <Text style={styles.tag}>twoj.io</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 120,
    marginBottom: 20,
  },
  tag: {
    fontSize: 14,
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
    color: '#D9E7F2',
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#4EABF4',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: 200,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
  }
});

export default HomeScreen;
