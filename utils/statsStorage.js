import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = 'SUDOKU_STATS_V1';
const DAILY_COMPLETION_KEY = 'SUDOKU_DAILY_COMPLETION_V1';

/**
 * Stats structure:
 * {
 *   totalPlayed: 0,
 *   totalWon: 0,
 *   modes: {
 *     [gameModeId]: {
 *       [difficulty]: {
 *         totalPlayed: 0,
 *         totalWon: 0,
 *         bestTime: null, // in seconds
 *         totalTime: 0,
 *         bestScore: 0,
 *         totalScore: 0,
 *       }
 *     }
 *   }
 * }
 */

export const getStats = async () => {
    try {
        const data = await AsyncStorage.getItem(STATS_KEY);
        const stats = data ? JSON.parse(data) : { totalPlayed: 0, totalWon: 0, totalScore: 0, modes: {}, uncompletedGames: {} };
        if (!stats.uncompletedGames) stats.uncompletedGames = {};
        return stats;
    } catch (error) {
        console.error('Error loading stats:', error);
        return { totalPlayed: 0, totalWon: 0, totalScore: 0, modes: {}, uncompletedGames: {} };
    }
};

export const startGameStat = async ({ gameModeId, difficulty, gameId }) => {
    try {
        if (!gameId) return;
        const stats = await getStats();
        
        // If we already started this game, don't count it again
        if (stats.uncompletedGames[gameId]) return stats;

        stats.totalPlayed += 1;
        stats.uncompletedGames[gameId] = true;

        const diffStr = String(difficulty);
        if (!stats.modes[gameModeId]) stats.modes[gameModeId] = {};
        if (!stats.modes[gameModeId][diffStr]) {
            stats.modes[gameModeId][diffStr] = {
                totalPlayed: 0,
                totalWon: 0,
                bestTime: null,
                totalTime: 0,
                bestScore: 0,
                totalScore: 0,
            };
        }

        const m = stats.modes[gameModeId][diffStr];
        m.totalPlayed += 1;

        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
        return stats;
    } catch (error) {
        console.error('Error saving game start:', error);
    }
};

export const saveGameResult = async ({ gameModeId, difficulty, time, score, won, gameId }) => {
    try {
        const stats = await getStats();
        
        // We no longer blindly increment totalPlayed here because it's done at level start.
        // But for backwards compatibility, if a game is won and we haven't seen it started (e.g., from old version),
        // we might not have it in uncompletedGames.
        // Actually, let's just assume `startGameStat` handled it. 
        // If a game finishes and we don't have gameId, or didn't start it, we can fallback increment totalPlayed.
        if (!gameId || (gameId && !stats.uncompletedGames[gameId] && won)) {
            // It could be an older game finalizing or missing gameId, safely increment to avoid missing win stats.
            // But if we do, this will double count if we just reload.
        }
        
        if (won) {
            stats.totalWon += 1;
            stats.totalScore = (stats.totalScore || 0) + score;
        }

        if (gameId && stats.uncompletedGames[gameId]) {
            delete stats.uncompletedGames[gameId];
        }

        const diffStr = String(difficulty);
        if (!stats.modes[gameModeId]) stats.modes[gameModeId] = {};
        if (!stats.modes[gameModeId][diffStr]) {
            stats.modes[gameModeId][diffStr] = {
                totalPlayed: 0,
                totalWon: 0,
                bestTime: null,
                totalTime: 0,
                bestScore: 0,
                totalScore: 0,
            };
        }

        const m = stats.modes[gameModeId][diffStr];
        if (won) {
            m.totalWon += 1;
            m.totalTime += time;
            m.totalScore += score;
            
            if (m.bestTime === null || time < m.bestTime) {
                m.bestTime = time;
            }
            if (score > m.bestScore) {
                m.bestScore = score;
            }
        }

        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
        return stats;
    } catch (error) {
        console.error('Error saving game result:', error);
    }
};

export const getDailyCompletion = async () => {
    try {
        const data = await AsyncStorage.getItem(DAILY_COMPLETION_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        return {};
    }
};

export const markDailyCompleted = async (dateStr) => {
    try {
        const completion = await getDailyCompletion();
        completion[dateStr] = true;
        await AsyncStorage.setItem(DAILY_COMPLETION_KEY, JSON.stringify(completion));
    } catch (error) {
        console.error('Error marking daily completed:', error);
    }
};

export const isDailyCompleted = async (dateStr) => {
    const completion = await getDailyCompletion();
    return !!completion[dateStr];
};

export const getDailyStreak = async () => {
    const completions = await getDailyCompletion();
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);

    // If not completed today, check if it was completed yesterday to continue streak
    const todayStr = today.toISOString().split('T')[0];
    if (!completions[todayStr]) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (completions[dateStr]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
};

export const getMonthlyCount = async () => {
    const completions = await getDailyCompletion();
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    return Object.keys(completions).filter(date => date.startsWith(yearMonth)).length;
};

export const getWeeklyCompletion = async () => {
    const completions = await getDailyCompletion();
    const today = new Date();
    const week = [];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        week.push({
            date: dateStr,
            completed: !!completions[dateStr],
            dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' })
        });
    }
    return week;
};

export const getLevelInfo = (totalScore = 0) => {
    // level = Math.floor(Math.sqrt(totalScore / 50)) + 1
    const level = Math.floor(Math.sqrt(totalScore / 50)) + 1;
    const currentLevelXP = Math.pow(level - 1, 2) * 50;
    const nextLevelXP = Math.pow(level, 2) * 50;
    const progress = (totalScore - currentLevelXP) / (nextLevelXP - currentLevelXP);
    
    return { level, progress, currentLevelXP, nextLevelXP, totalScore };
};
