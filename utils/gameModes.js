/**
 * Centralised game-mode registry.
 * To add a new image pack just push a new entry here — the rest of the app
 * (HomeScreen, LevelSelectScreen, Sudoku number picker, Square cell renderer)
 * all read from this config automatically.
 */

export const GAME_MODES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional number sudoku',
    icon: '🔢',
    images: null, // null  = show numbers
    maxGridSize: 4, // 16x16 board
  },
  {
    id: 'diamonds',
    name: 'Diamonds',
    description: 'Play with sparkling diamonds',
    icon: '💎',
    maxGridSize: 3, // 9x9 board max (images only cover values 1-9)
    images: {
      0: require('../assets/games/diamonds/d0.png'),
      1: require('../assets/games/diamonds/d1.png'),
      2: require('../assets/games/diamonds/d2.png'),
      3: require('../assets/games/diamonds/d3.png'),
      4: require('../assets/games/diamonds/d4.png'),
      5: require('../assets/games/diamonds/d5.png'),
      6: require('../assets/games/diamonds/d6.png'),
      7: require('../assets/games/diamonds/d7.png'),
      8: require('../assets/games/diamonds/d8.png'),
      9: require('../assets/games/diamonds/d9.png'),
    },
  },
  // ── future packs go here ──────────────────────────────────────────────────
  // {
  //   id: 'fruits',
  //   name: 'Fruits',
  //   description: 'Play with fruit images',
  //   icon: '🍎',
  //   images: { 1: require('../assets/games/fruits/f1.png'), ... },
  // },
];

/** Returns the mode config for the given id, falling back to 'classic'. */
export const getGameMode = (id) => GAME_MODES.find(m => m.id === id) ?? GAME_MODES[0];
