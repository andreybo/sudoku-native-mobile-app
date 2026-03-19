import React, { useContext, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../utils/ThemeContext';
import PanelCard from './PanelCard';

const ModeCarousel = ({ modes, selectedModeId, onSelect }) => {
  const { theme } = useContext(ThemeContext);

  const selectedIndex = useMemo(() => {
    const found = modes.findIndex(mode => mode.id === selectedModeId);
    return found >= 0 ? found : 0;
  }, [modes, selectedModeId]);

  const selectedMode = modes[selectedIndex] || modes[0];
  const preview = selectedMode?.images?.[1];
  const hasPreview = Boolean(preview);

  const goPrev = () => {
    const nextIndex = selectedIndex <= 0 ? modes.length - 1 : selectedIndex - 1;
    onSelect(modes[nextIndex].id);
  };

  const goNext = () => {
    const nextIndex = selectedIndex >= modes.length - 1 ? 0 : selectedIndex + 1;
    onSelect(modes[nextIndex].id);
  };

  if (!selectedMode) {
    return null;
  }

  return (
    <View>

      <PanelCard tone="accent" style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: theme.subText }]}>Game Type</Text>
        <Text style={[styles.counter, { color: theme.subText }]}>{selectedIndex + 1}/{modes.length}</Text>
      </View>
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={goPrev}
            style={[styles.arrowButton, { backgroundColor: theme.cardAlt, borderColor: theme.borderStrong }]}
          >
            <Text style={[styles.arrowText, { color: theme.text }]}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} onPress={goNext} style={styles.centerWrap}>
            <View style={[styles.preview]}>
              {hasPreview ? (
                <Image source={preview} style={styles.previewImage} resizeMode="contain" />
              ) : (
                <Text style={styles.previewIcon}>{selectedMode.icon}</Text>
              )}
            </View>
            <Text style={[styles.name, { color: theme.text }]}>{selectedMode.name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={goNext}
            style={[styles.arrowButton, { backgroundColor: theme.primary, borderColor: theme.primaryDark }]}
          >
            <Text style={[styles.arrowText, { color: '#fff' }]}>›</Text>
          </TouchableOpacity>
        </View>
      </PanelCard>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  counter: {
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arrowButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: -3,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: 70,
    height: 70,
    borderRadius: 0,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '74%',
    height: '74%',
  },
  previewIcon: {
    fontSize: 38,
  },
  name: {
    marginTop: 0,
    fontSize: 22,
    fontWeight: '900',
  },
});

export default ModeCarousel;
