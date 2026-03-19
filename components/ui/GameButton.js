import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../utils/ThemeContext';

const GameButton = ({
  title,
  subtitle,
  icon,
  onPress,
  variant = 'primary',
  compact = false,
  disabled = false,
  showBadge = false,
  badgeColor,
  style,
}) => {
  const { theme } = useContext(ThemeContext);
  const isPrimary = variant === 'primary';
  const isAccent = variant === 'accent';

  const backgroundColor = isPrimary
    ? theme.primary
    : isAccent
      ? theme.accent
      : theme.card;

  const borderColor = isPrimary || isAccent ? 'transparent' : theme.borderStrong;
  const textColor = isPrimary || isAccent ? '#FFFFFF' : theme.text;
  const subColor = isPrimary || isAccent ? 'rgba(255,255,255,0.82)' : theme.subText;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        compact && styles.compact,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.55 : 1,
          shadowColor: theme.shadow,
        },
        style,
      ]}
    >
      <View pointerEvents="none" style={[styles.gloss, { backgroundColor: theme.textureTint }]} />
      <View style={styles.content}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: subColor }]}>{subtitle}</Text> : null}
        </View>
      </View>
      {showBadge && (
        <View style={[styles.badge, { backgroundColor: badgeColor || theme.accent }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  compact: {
    minHeight: 48,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 20,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },
});

export default GameButton;
