import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../utils/ThemeContext';
import PanelCard from './PanelCard';

const OptionStepper = ({ label, valueLabel, helper, onDecrease, onIncrease, leftDisabled, rightDisabled }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <PanelCard style={styles.card}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={leftDisabled}
          onPress={onDecrease}
          style={[
            styles.stepButton,
            {
              backgroundColor: theme.cardAlt,
              borderColor: theme.borderStrong,
              opacity: leftDisabled ? 0.45 : 1,
            },
          ]}
        >
          <Text style={[styles.stepText, { color: theme.text }]}>-</Text>
        </TouchableOpacity>

        <View style={styles.centerWrap}>
          <Text style={[styles.value, { color: theme.text }]}>{valueLabel}</Text>
          {helper ? <Text style={[styles.helper, { color: theme.subText }]}>{helper}</Text> : null}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={rightDisabled}
          onPress={onIncrease}
          style={[
            styles.stepButton,
            {
              backgroundColor: theme.primary,
              borderColor: theme.primaryDark,
              opacity: rightDisabled ? 0.45 : 1,
            },
          ]}
        >
          <Text style={[styles.stepText, { color: '#fff' }]}>+</Text>
        </TouchableOpacity>
      </View>
    </PanelCard>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
  },
  stepButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: -2,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
  },
  helper: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default OptionStepper;
