// AsyncStorage native module is not linked in the current build.
// Using an in-memory store so the app loads cleanly.
// Re-link @react-native-async-storage/async-storage (rebuild the APK) to
// make custom games persist across sessions.
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

let _memoryStore = [];

const AsyncStorage = {
  getItem: async () => null,
  setItem: async (_key, value) => { _memoryStore = JSON.parse(value); },
};

const STORAGE_KEY = '@SudokuMix:CustomGames';

/**
 * Custom Game Structure:
 * {
 *   id: string,
 *   name: string,
 *   images: {
 *     1: string (path),
 *     2: string,
 *     ...
 *     9: string
 *   },
 *   createdAt: number
 * }
 */

export const getCustomGames = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : _memoryStore;
  } catch (error) {
    console.error('Failed to load custom games', error);
    return _memoryStore;
  }
};

export const getCustomGameById = async (id) => {
  const games = await getCustomGames();
  return games.find((g) => g.id === id);
};

export const saveCustomGame = async (gameData) => {
  try {
    const games = await getCustomGames();

    const gameId = gameData.id || uuidv4();

    // Store image URIs as-is (file copying requires react-native-fs which is not linked)
    const processedImages = {};
    for (let i = 1; i <= 9; i++) {
      if (gameData.images[i]) {
        processedImages[i] = gameData.images[i];
      }
    }

    const newGame = {
      id: gameId,
      name: gameData.name || `Custom Game ${games.length + 1}`,
      images: processedImages,
      createdAt: gameData.createdAt || Date.now(),
    };

    const existingIndex = games.findIndex((g) => g.id === newGame.id);
    if (existingIndex >= 0) {
      games[existingIndex] = newGame;
    } else {
      games.push(newGame);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    return newGame;
  } catch (error) {
    console.error('Failed to save custom game', error);
    throw error;
  }
};

export const deleteCustomGame = async (id) => {
  try {
    const games = await getCustomGames();
    const updatedGames = games.filter((g) => g.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGames));
  } catch (error) {
    console.error('Failed to delete custom game', error);
    throw error;
  }
};
