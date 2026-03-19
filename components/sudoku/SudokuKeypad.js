import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import PanelCard from '../ui/PanelCard';
import styles from './styles';

const SudokuKeypad = ({
  theme,
  gameMode,
  totalCells,
  pickerGap,
  btnSize,
  btnFontSize,
  isNoteMode,
  setIsNoteMode,
  hapticsEnabled,
  hapticOptions,
  selectedNumber,
  onNumberPress,
}) => {
  const { images } = gameMode;

  return (
    <PanelCard style={styles.keypadCard}>

      <View style={[styles.numberRow, { gap: pickerGap }]}>
        {Array.from({ length: totalCells }, (_, index) => index + 1).map(numberValue => {
          const active = selectedNumber === numberValue && !isNoteMode;

          return (
            <TouchableOpacity
              key={`picker-${numberValue}`}
              activeOpacity={0.82}
              style={[
                styles.btnNumber,
                {
                  width: btnSize,
                  height: btnSize,
                  backgroundColor: active ? theme.primary : theme.cardAlt,
                  borderColor: active ? theme.primaryDark : theme.borderStrong,
                  shadowColor: theme.shadow,
                },
              ]}
              onPress={() => onNumberPress(numberValue)}
            >
              <View pointerEvents="none" style={[styles.numberGloss, { backgroundColor: theme.textureTint }]} />
              {images?.[numberValue] ? (
                <Image source={images[numberValue]} style={styles.numberImage} resizeMode="contain" />
              ) : (
                <Text
                  style={[
                    styles.numberText,
                    { color: active ? '#fff' : theme.primaryDark, fontSize: btnFontSize },
                  ]}
                >
                  {numberValue}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.82}
          style={[
            styles.btnNumber,
            {
              width: btnSize,
              height: btnSize,
              backgroundColor: theme.accent,
              borderColor: theme.accent,
              shadowColor: theme.shadow,
            },
          ]}
          onPress={() => onNumberPress(null)}
        >
          <Text style={[styles.numberText, { color: '#fff', fontSize: btnFontSize - 1 }]}>⌫</Text>
        </TouchableOpacity>
      </View>
    </PanelCard>
  );
};

export default SudokuKeypad;
