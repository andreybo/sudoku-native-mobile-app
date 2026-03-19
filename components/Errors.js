import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../utils/ThemeContext';

const Errors = ({ error, type = 'error' }) => {
  const { theme } = useContext(ThemeContext);
  const backgroundColor = type === 'success' ? theme.successBackground : theme.errorBackground;
  const textColor = type === 'success' ? theme.successText : theme.errorText;

  if (!error) {
    return null;
  }

  return (
    <View style={[styles.banner, { backgroundColor, borderColor: textColor }]}> 
      <Text style={[styles.text, { color: textColor }]}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
});

export default Errors;
