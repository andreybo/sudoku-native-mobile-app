import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import ClassicGameScreen from './screens/games/Classic/ClassicGameScreen';
import EggsGameScreen from './screens/games/Eggs/EggsGameScreen';
import ClassicLevel from './screens/games/Classic/ClassicLevel';
import Eggs from './screens/games/Eggs/Eggs';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: ''}}
          />
          <Stack.Screen name="Classic game" component={ClassicGameScreen} />
          <Stack.Screen name="Eggs game" component={EggsGameScreen} />
          <Stack.Screen name="Classic level" component={ClassicLevel} />
          <Stack.Screen name="Eggs" component={Eggs} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
