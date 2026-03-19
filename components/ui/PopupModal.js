import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../../utils/ThemeContext';
import PanelCard from './PanelCard';
import GameButton from './GameButton';

const PopupModal = ({
  visible,
  icon,
  title,
  message,
  chips = [],
  actions = [],
  onDismiss,
}) => {
  const { theme } = useContext(ThemeContext);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 90,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.92);
    }
  }, [opacity, scale, visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <Animated.View style={[styles.overlay, { backgroundColor: theme.modalBackdrop, opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
          <PanelCard style={styles.card} tone="accent">
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <Text style={styles.badgeIcon}>{icon}</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            {message ? <Text style={[styles.message, { color: theme.subText }]}>{message}</Text> : null}
            {chips.length ? (
              <View style={styles.chips}>
                {chips.map(chip => {
                  const accent = chip.tone === 'accent';
                  const chipBackground = accent ? theme.accent : theme.cardAlt;
                  const chipColor = accent ? '#fff' : theme.text;
                  const chipSubColor = accent ? 'rgba(255,255,255,0.82)' : theme.subText;

                  return (
                    <View key={chip.label} style={[styles.chip, { backgroundColor: chipBackground }]}>
                      <Text style={[styles.chipLabel, { color: chipSubColor }]}>{chip.label}</Text>
                      <Text style={[styles.chipValue, { color: chipColor }]}>{chip.value}</Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
            <View style={styles.actions}>
              {actions.map(action => (
                <GameButton
                  key={action.title}
                  title={action.title}
                  subtitle={action.subtitle}
                  icon={action.icon}
                  variant={action.variant || 'secondary'}
                  onPress={action.onPress}
                  compact
                />
              ))}
            </View>
          </PanelCard>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 18,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  badgeIcon: {
    fontSize: 34,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '700',
  },
  chips: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  chip: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chipValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '900',
  },
  actions: {
    width: '100%',
    gap: 10,
    marginTop: 18,
  },
});

export default PopupModal;
