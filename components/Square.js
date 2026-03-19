import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getGameMode } from '../utils/gameModes';

// isSelected / isHighlighted / isSameBlock are gone — selection highlights are
// now drawn as cheap absolute overlay Views in Board.js so that tapping a cell
// triggers ZERO Square re-renders.
// Theme colours are passed as plain props to remove 256 useContext subscriptions.
const Square = ({
  value,
  onPress,
  isPreGenerated,
  size,
  game = 'classic',
  notes,
  rowIndex,
  colIndex,
  gridScale,
  textColor,
  userTextColor,
  noteColor,
}) => {
  const animationValue = useRef(new Animated.Value(value ? 1 : 0.9)).current;
  const { images } = useMemo(() => getGameMode(game), [game]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: value ? 1.12 : 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(animationValue, {
        toValue: 1,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animationValue, value]);

  const noteColumns = useMemo(() => Math.ceil(Math.sqrt(gridScale || 9)), [gridScale]);
  const noteItems = useMemo(
    () => Array.from({ length: gridScale || 9 }, (_, index) => index + 1),
    [gridScale],
  );

  const renderedNotes = useMemo(() => {
    if (!notes || notes.length === 0) {
      return null;
    }
    return (
      <View style={styles.notesContainer}>
        {noteItems.map(n => (
          <Text
            key={n}
            style={[
              styles.noteText,
              {
                width: `${100 / noteColumns}%`,
                fontSize: Math.max(7, size * 0.26),
                color: noteColor,
              },
            ]}
          >
            {notes.includes(n) ? n : ' '}
          </Text>
        ))}
      </View>
    );
  }, [notes, noteItems, noteColumns, size, noteColor]);

  const resolvedTextColor = isPreGenerated ? textColor : userTextColor;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => onPress(rowIndex, colIndex)}
      style={styles.cell}
    >
      {images && value && images[value] ? (
        <Animated.Image
          source={images[value]}
          resizeMode="contain"
          style={[styles.image, { transform: [{ scale: animationValue }] }]}
        />
      ) : value ? (
        <Animated.Text
          style={[
            styles.value,
            {
              color: resolvedTextColor,
              fontSize: size,
              fontWeight: isPreGenerated ? '800' : '900',
              transform: [{ scale: animationValue }],
            },
          ]}
        >
          {value}
        </Animated.Text>
      ) : (
        renderedNotes
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  image: {
    width: '84%',
    height: '84%',
  },
  value: {
    includeFontPadding: false,
  },
  notesContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
    paddingVertical: 2,
  },
  noteText: {
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default React.memo(Square, (prev, next) => {
  if (prev.value !== next.value) return false;
  if (prev.isPreGenerated !== next.isPreGenerated) return false;
  if (prev.size !== next.size) return false;
  if (prev.game !== next.game) return false;
  if (prev.gridScale !== next.gridScale) return false;
  if (prev.textColor !== next.textColor) return false;
  if (prev.userTextColor !== next.userTextColor) return false;
  if (prev.noteColor !== next.noteColor) return false;

  const prevNotes = prev.notes || [];
  const nextNotes = next.notes || [];
  if (prevNotes.length !== nextNotes.length) return false;
  for (let i = 0; i < prevNotes.length; i += 1) {
    if (prevNotes[i] !== nextNotes[i]) return false;
  }

  return true;
});
