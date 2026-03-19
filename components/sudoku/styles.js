import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBlob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    top: -50,
    right: -40,
    opacity: 0.5,
  },
  bottomBlob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    bottom: -90,
    left: -50,
    opacity: 0.42,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 13,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 12,
  },
  hudCard: {
    paddingBottom: 16,
  },
  hudTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: -2,
  },
  titleWrap: {
    flex: 1,
  },
  gameModeTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  gameModeSubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  metaChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  boardWrap: {
    alignItems: 'center',
    marginTop: 2,
  },
  selectionHint: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  keypadCard: {
    paddingTop: 14,
    paddingBottom: 16,
  },
  keypadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noteToggle: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  noteToggleText: {
    fontSize: 13,
    fontWeight: '800',
  },
  numberRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnNumber: {
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3,
  },
  numberGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
  },
  numberText: {
    fontWeight: '900',
  },
  numberImage: {
    width: '72%',
    height: '72%',
  },
  utilityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  utilityButton: {
    flex: 1,
  },
  loadingScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    borderRadius: 28,
    borderWidth: 2,
    paddingHorizontal: 44,
    paddingVertical: 40,
    alignItems: 'center',
    width: '78%',
  },
  loadingIcon: {
    fontSize: 72,
    marginBottom: 18,
  },
  loadingTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6,
  },
  loadingSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 32,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 10,
  },
  loadingDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
});

export default styles;
