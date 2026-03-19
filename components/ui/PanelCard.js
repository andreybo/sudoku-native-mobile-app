import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeContext } from '../../utils/ThemeContext';

const PanelCard = ({ children, style, tone = 'default' }) => {
  const { theme } = useContext(ThemeContext);

  const backgroundColor = tone === 'accent' ? theme.cardAlt : theme.card;
  const borderColor = tone === 'accent' ? theme.primarySoft : theme.border;

  return (
    <View style={[styles.card, { backgroundColor, borderColor, shadowColor: theme.shadow }, style]}>
      <View pointerEvents="none" style={[styles.innerGlow, { backgroundColor: theme.textureTint }]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    borderWidth: 2,
    padding: 18,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
  },
});

export default PanelCard;
