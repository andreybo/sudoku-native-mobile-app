import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Board from './Board';
import SubmitBoard from './SubmitBoard';
import Errors from './Errors';
import GameButton from './ui/GameButton';
import { formatElapsedTime } from './ui/GameTimer';
import PopupModal from './ui/PopupModal';
import SudokuHeader from './sudoku/SudokuHeader';
import SudokuKeypad from './sudoku/SudokuKeypad';
import styles from './sudoku/styles';
import { ThemeContext } from '../utils/ThemeContext';
import soundManager from '../utils/SoundManager';
import { getGameMode } from '../utils/gameModes';
import {
  checkBoardValid,
  checkIsBoardFull,
  initializeBoard,
  isValid,
} from '../utils/sudokuLogic';
import { startGameStat, saveGameResult, markDailyCompleted } from '../utils/statsStorage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const DIFFICULTY_META = {
  '-1': { label: 'Easy', icon: '+', helper: 'Relaxed pace' },
  '0': { label: 'Normal', icon: '++', helper: 'Balanced run' },
  '1': { label: 'Hard', icon: '+++', helper: 'Tough puzzle' },
};

const Sudoku = ({ gridSize, diff, game, isDaily = false }) => {
  const { theme, hapticsEnabled, soundEnabled, hintsEnabled, setHintsEnabled } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { width: screenWidth } = useWindowDimensions();
  const gameMode = getGameMode(game);
  const difficultyMeta = DIFFICULTY_META[String(diff)] || DIFFICULTY_META['0'];
  const statusTimeoutRef = useRef(null);
  const timerRef = useRef(null);
  const gameWonRef = useRef(false);
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const loadingLoopRef = useRef(null);
  const loadingTimeoutRef = useRef(null);
  const currentGameIdRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  const pickerGap = 8;
  const pickerColumns = gridSize === 4 ? 6 : gridSize === 3 ? 5 : 3;
  const btnSize = Math.max(
    42,
    Math.min(58, Math.floor((screenWidth - 34 - pickerGap * (pickerColumns - 1)) / pickerColumns)),
  );
  const btnFontSize = Math.max(14, Math.floor(btnSize * 0.36));

  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedColIndex, setSelectedColIndex] = useState(null);
  const [notes, setNotes] = useState({});
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState({ message: '', type: 'error' });
  const [modalConfig, setModalConfig] = useState({ visible: false, actions: [] });
  const [score, setScore] = useState(0);

  const showStatus = useCallback((message, type = 'error') => {
    clearTimeout(statusTimeoutRef.current);
    setStatus({ message, type });
    statusTimeoutRef.current = setTimeout(() => {
      setStatus({ message: '', type: 'error' });
    }, 2200);
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig(prev => ({ ...prev, visible: false }));
  }, []);

  // Start / stop the loading dot animation based on isLoading
  useEffect(() => {
    if (isLoading) {
      loadingAnim.setValue(0);
      loadingLoopRef.current = Animated.loop(
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      );
      loadingLoopRef.current.start();
    } else {
      loadingLoopRef.current?.stop();
    }
  }, [isLoading, loadingAnim]);

  const reloadView = useCallback(() => {
    // Show loading screen immediately and reset all game state
    setIsLoading(true);
    setBoard([]);
    setInitialBoard([]);
    setSelectedNumber(null);
    setSelectedRowIndex(null);
    setSelectedColIndex(null);
    setNotes({});
    setIsNoteMode(false);
    setStatus({ message: '', type: 'error' });
    setModalConfig({ visible: false, actions: [] });
    gameWonRef.current = false;
    setSeconds(0);
    clearInterval(timerRef.current);
    clearTimeout(loadingTimeoutRef.current);

    const loadStart = Date.now();

    // Yield to the React renderer so the loading screen paints BEFORE
    // initializeBoard() blocks the JS thread (critical for 16×16)
    loadingTimeoutRef.current = setTimeout(() => {
      let seed = null;
      if (isDaily) {
        const today = new Date();
        seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
      }

      const newInitialBoard = initializeBoard(gridSize, diff, seed);
      const elapsed = Date.now() - loadStart;
      const remaining = Math.max(0, 2000 - elapsed);
      const newGameId = uuidv4();
      currentGameIdRef.current = newGameId;
      startGameStat({ gameModeId: game, difficulty: diff, gameId: newGameId });

      // Enforce minimum 2-second loading time; waits longer if generation was slow
      loadingTimeoutRef.current = setTimeout(() => {
        setBoard(newInitialBoard.map(row => [...row]));
        setInitialBoard(newInitialBoard.map(row => [...row]));
        setMistakes(0);
        setScore(0);
        setIsLoading(false);
        timerRef.current = setInterval(() => {
          if (!gameWonRef.current) {
            setSeconds(current => current + 1);
          }
        }, 1000);
      }, remaining);
    }, 50);
  }, [diff, gridSize, isDaily]);

  useEffect(() => {
    reloadView();
  }, [reloadView, game]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearTimeout(statusTimeoutRef.current);
    clearTimeout(loadingTimeoutRef.current);
    loadingLoopRef.current?.stop();
  }, []);

  const setSelectedCell = useCallback((rowIndex, colIndex) => {
    if (hapticsEnabled) {
      ReactNativeHapticFeedback.trigger('selection', hapticOptions);
    }
    setSelectedRowIndex(rowIndex);
    setSelectedColIndex(colIndex);
  }, [hapticsEnabled]);

  const { filledByUser, totalEmpty } = useMemo(() => {
    let filled = 0;
    let empty = 0;

    for (let rowIndex = 0; rowIndex < board.length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < (board[rowIndex]?.length || 0); colIndex += 1) {
        if (initialBoard[rowIndex]?.[colIndex] === 0) {
          empty += 1;
          if (board[rowIndex][colIndex] !== 0) {
            filled += 1;
          }
        }
      }
    }

    return { filledByUser: filled, totalEmpty: empty };
  }, [board, initialBoard]);

  const progress = totalEmpty > 0 ? filledByUser / totalEmpty : 0;

  const boardWithStatus = useMemo(
    () => board.map((row, rowIndex) => row.map((cell, colIndex) => ({
      value: cell > 0 ? cell : null,
      isPreGenerated: initialBoard[rowIndex]?.[colIndex] !== 0,
      notes: notes[`${rowIndex}-${colIndex}`] || [],
    }))),
    [board, initialBoard, notes],
  );

  const boardValid = useCallback(() => checkBoardValid(board, gridSize), [board, gridSize]);
  const isBoardFull = useCallback(() => checkIsBoardFull(board, gridSize), [board, gridSize]);

  const openCheckModal = useCallback(() => {
    const valid = boardValid();
    const full = isBoardFull();

    if (valid) {
      if (hapticsEnabled) {
        ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
      }
      
      const actions = [
        {
          title: 'Keep Playing',
          subtitle: 'Back to the board',
          icon: '▶',
          variant: 'primary',
          onPress: closeModal,
        },
      ];
      
      if (!full && diff !== 1) {
        actions.push({
          title: hintsEnabled ? 'Hints: ON' : 'Hints: OFF',
          subtitle: 'Toggle invalid move warnings',
          icon: hintsEnabled ? '👁' : '🕶',
          variant: 'secondary',
          onPress: () => {
            closeModal();
            setHintsEnabled(!hintsEnabled);
            showStatus(!hintsEnabled ? 'Live hints enabled' : 'Live hints disabled', 'success');
          },
        });
      }

      setModalConfig({
        visible: true,
        icon: full ? '🏆' : '✨',
        title: full ? 'Board Completed' : 'Board Looks Clean',
        message: full
          ? 'Everything is valid. Great finish.'
          : 'No conflicts found in the current state. Keep pushing.',
        chips: [
          { label: 'Progress', value: `${Math.round(progress * 100)}%`, tone: 'accent' },
          { label: 'Time', value: formatElapsedTime(seconds), tone: 'default' },
        ],
        actions,
      });
      showStatus('No conflicts found.', 'success');
      return;
    }

    if (hapticsEnabled) {
      ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
    }
    if (soundEnabled) {
      soundManager.playError();
    }
    const newActions = [];
    if (diff !== 1) {
      newActions.push({
        title: 'Fix It',
        subtitle: 'Highlight and clear one error',
        icon: '↺',
        variant: 'accent',
        onPress: () => {
          closeModal();
          for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < (board[r]?.length || 0); c++) {
              if (board[r][c] !== 0 && initialBoard[r]?.[c] === 0) {
                const val = board[r][c];
                const bCopy = board.map(row => [...row]);
                bCopy[r][c] = 0;
                if (!isValid(bCopy, r, c, val, gridSize)) {
                  setSelectedCell(r, c);
                  if (soundEnabled) {
                    soundManager.playClick();
                  }
                  setBoard(bCopy);
                  showStatus('Conflict removed', 'success');
                  return;
                }
              }
            }
          }
        },
      });
      newActions.push({
        title: hintsEnabled ? 'Hints: ON' : 'Hints: OFF',
        subtitle: 'Toggle invalid move warnings',
        icon: hintsEnabled ? '👁' : '🕶',
        variant: 'secondary',
        onPress: () => {
          closeModal();
          setHintsEnabled(!hintsEnabled);
          showStatus(!hintsEnabled ? 'Live hints enabled' : 'Live hints disabled', 'success');
        },
      });
    } else {
      newActions.push({
        title: 'Close',
        subtitle: 'Return to game',
        icon: '✕',
        variant: 'secondary',
        onPress: closeModal,
      });
    }

    setModalConfig({
      visible: true,
      icon: '⚠️',
      title: 'Conflicts Detected',
      message: diff === 1 ? 'Hints and auto-fixes are disabled in Hard mode.' : 'Some cells currently break sudoku rules.',
      chips: [
        { label: 'Progress', value: `${Math.round(progress * 100)}%`, tone: 'accent' },
        { label: 'Tip', value: 'Check highlights', tone: 'default' },
      ],
      actions: newActions,
    });
    showStatus('There are mistakes on the board.', 'error');
  }, [
    board,
    initialBoard,
    gridSize,
    boardValid,
    closeModal,
    hapticsEnabled,
    isBoardFull,
    progress,
    seconds,
    setSelectedCell,
    showStatus,
    soundEnabled,
    diff,
    hintsEnabled,
    setHintsEnabled,
  ]);

  const clearUserInputs = useCallback(() => {
    setBoard(initialBoard.map(row => [...row]));
    setNotes({});
    setSelectedNumber(null);
    showStatus('All player moves cleared.', 'success');
  }, [initialBoard, showStatus]);

  const openClearModal = useCallback(() => {
    setModalConfig({
      visible: true,
      icon: '🧹',
      title: 'Clear Your Moves?',
      message: 'Given cells stay locked. Your notes and entered values will be removed.',
      actions: [
        {
          title: 'Cancel',
          subtitle: 'Keep current board',
          icon: '←',
          variant: 'secondary',
          onPress: closeModal,
        },
        {
          title: 'Clear Now',
          subtitle: 'Reset my moves',
          icon: '⌫',
          variant: 'accent',
          onPress: () => {
            closeModal();
            clearUserInputs();
          },
        },
      ],
    });
  }, [clearUserInputs, closeModal]);

  const openReloadModal = useCallback(() => {
    setModalConfig({
      visible: true,
      icon: '🎲',
      title: 'Generate New Game?',
      message: 'This starts a fresh board with the same mode, difficulty and grid size.',
      actions: [
        {
          title: 'Stay Here',
          subtitle: 'Keep this run',
          icon: '↩',
          variant: 'secondary',
          onPress: closeModal,
        },
        {
          title: 'New Game',
          subtitle: 'Restart with same setup',
          icon: '↻',
          variant: 'primary',
          onPress: () => {
            closeModal();
            reloadView();
          },
        },
      ],
    });
  }, [closeModal, reloadView]);

  const openWinModal = useCallback(() => {
    const totalCellsCount = gridSize * gridSize;
    gameWonRef.current = true;
    clearInterval(timerRef.current);

    // Calculate rebalanced score
    const baseP = gridSize === 2 ? 10 : gridSize === 3 ? 50 : 250;
    const diffM = diff === -1 ? 1 : diff === 0 ? 1.5 : 3;
    const modeM = game === 'classic' ? 1 : game === 'diamonds' ? 1.2 : 1.1;

    const currentBase = Math.round(baseP * diffM * modeM);
    const expectedT = gridSize * gridSize * 150;

    const mistakeP = mistakes * 10;
    const timeFactor = Math.max(0, 1 - (seconds / (expectedT * 2)));
    const timeBonus = Math.round(currentBase * 0.5 * timeFactor);
    const perfectBonus = mistakes === 0 ? Math.round(currentBase * 0.5) : 0;
    const speedBonus = seconds < expectedT ? Math.round(currentBase * 0.5) : 0;

    const rawScore = currentBase + timeBonus + perfectBonus + speedBonus - mistakeP;
    const finalScore = Math.max(Math.round(currentBase * 0.2), Math.round(rawScore));
    setScore(finalScore);

    // Save stats
    saveGameResult({
      gameModeId: game,
      difficulty: diff,
      time: seconds,
      score: finalScore,
      won: true,
      gameId: currentGameIdRef.current
    });

    if (isDaily) {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      markDailyCompleted(dateStr);
    }

    if (hapticsEnabled) {
      ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
    }
    if (soundEnabled) {
      soundManager.playSuccess();
    }

    setModalConfig({
      visible: true,
      icon: '👑',
      title: 'Victory',
      message: `You cleared the ${gameMode.name} ${totalCellsCount}x${totalCellsCount} board on ${difficultyMeta.label}.`,
      chips: [
        { label: 'Score', value: String(finalScore), tone: 'accent' },
        { label: 'Time', value: formatElapsedTime(seconds), tone: 'default' },
        { label: 'Mistakes', value: String(mistakes), tone: mistakes > 0 ? 'default' : 'accent' },
      ],
      actions: [
        {
          title: 'Play Again',
          subtitle: 'New board, same setup',
          icon: '↻',
          variant: 'primary',
          onPress: () => {
            closeModal();
            reloadView();
          },
        },
        {
          title: 'Menu',
          icon: '⌂',
          variant: 'secondary',
          onPress: () => {
            closeModal();
            navigation.goBack();
          },
        },
      ],
    });
    showStatus(`Puzzle solved in ${formatElapsedTime(seconds)}.`, 'success');
  }, [
    closeModal,
    difficultyMeta.label,
    gameMode.name,
    gridSize,
    hapticsEnabled,
    navigation,
    reloadView,
    seconds,
    showStatus,
    soundEnabled,
  ]);

  const changeValueOnBoard = useCallback((value, rowIndex, colIndex) => {
    const newBoard = board.map((row, currentRowIndex) => (
      currentRowIndex === rowIndex
        ? row.map((cell, currentColIndex) => (currentColIndex === colIndex ? value : cell))
        : row
    ));

    setBoard(newBoard);
    if (soundEnabled) {
      soundManager.playClick();
    }

    if (checkIsBoardFull(newBoard, gridSize) && checkBoardValid(newBoard, gridSize)) {
      openWinModal();
    } else if (checkIsBoardFull(newBoard, gridSize)) {
      if (hapticsEnabled) {
        ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
      }
      if (soundEnabled) {
        soundManager.playError();
      }
      showStatus('Board is full, but there are conflicts.', 'error');
    }
  }, [board, gridSize, hapticsEnabled, openWinModal, showStatus, soundEnabled]);

  const handleNumberPress = useCallback((numberValue) => {
    if (selectedRowIndex === null || selectedColIndex === null) {
      showStatus('Select a cell first.', 'error');
      return;
    }

    if (hapticsEnabled) {
      ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    }

    if (initialBoard[selectedRowIndex]?.[selectedColIndex] !== 0) {
      if (hapticsEnabled) {
        ReactNativeHapticFeedback.trigger('notificationWarning', hapticOptions);
      }
      showStatus('This cell is locked.', 'error');
      return;
    }

    setSelectedNumber(numberValue);
    const key = `${selectedRowIndex}-${selectedColIndex}`;

    if (isNoteMode && numberValue !== null) {
      const existingNotes = notes[key] || [];
      const nextNotes = existingNotes.includes(numberValue)
        ? existingNotes.filter(entry => entry !== numberValue)
        : [...existingNotes, numberValue].sort((a, b) => a - b);
      setNotes({
        ...notes,
        [key]: nextNotes,
      });
      return;
    }

    const nextValue = numberValue === null ? 0 : numberValue;

    // Optional: Check if the value is correct immediately if we want to track "mistakes"
    // For now, let's just track if it's valid in the current context
    if (nextValue !== 0) {
      const isVal = isValid(board, selectedRowIndex, selectedColIndex, nextValue, gridSize);
      if (!isVal) {
        setMistakes(m => m + 1);
        if (hintsEnabled && diff !== 1) {
          if (soundEnabled) soundManager.playError();
          showStatus('Invalid move!', 'error');
        }
      }
    }

    changeValueOnBoard(nextValue, selectedRowIndex, selectedColIndex);

    if (nextValue !== 0) {
      const updatedNotes = { ...notes };
      delete updatedNotes[key];
      setNotes(updatedNotes);
    }
  }, [
    changeValueOnBoard,
    hapticsEnabled,
    initialBoard,
    isNoteMode,
    notes,
    selectedColIndex,
    selectedRowIndex,
    showStatus,
    hintsEnabled,
    diff,
  ]);

  const totalCells = gridSize * gridSize;

  if (isLoading) {
    const iconScale = loadingAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.86, 1.12, 0.86],
    });
    const dot1Opacity = loadingAnim.interpolate({
      inputRange: [0, 0.16, 0.45, 1],
      outputRange: [0.22, 1, 0.22, 0.22],
    });
    const dot2Opacity = loadingAnim.interpolate({
      inputRange: [0, 0.33, 0.62, 1],
      outputRange: [0.22, 0.22, 1, 0.22],
    });
    const dot3Opacity = loadingAnim.interpolate({
      inputRange: [0, 0.55, 0.78, 1],
      outputRange: [0.22, 0.22, 1, 0.22],
    });

    return (
      <View style={[styles.screen, styles.loadingScreen, { backgroundColor: theme.background }]}>
        <View style={[styles.loadingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            {gameMode.images ? (
              <Image 
                source={gameMode.images[1]} 
                style={{ width: 68, height: 68, marginBottom: 18 }} 
                resizeMode="contain" 
              />
            ) : (
              <Text style={styles.loadingIcon}>
                {gameMode.icon}
              </Text>
            )}
          </Animated.View>
          <Text style={[styles.loadingTitle, { color: theme.text }]}>{gameMode.name}</Text>
          <Text style={[styles.loadingSubtitle, { color: theme.subText }]}>
            {totalCells}×{totalCells} · {difficultyMeta.label}
          </Text>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.loadingDot, { backgroundColor: theme.primary, opacity: dot1Opacity }]} />
            <Animated.View style={[styles.loadingDot, { backgroundColor: theme.primary, opacity: dot2Opacity }]} />
            <Animated.View style={[styles.loadingDot, { backgroundColor: theme.primary, opacity: dot3Opacity }]} />
          </View>
        </View>
      </View>
    );
  }

  // Live rebalanced score calculation
  const baseP = gridSize === 2 ? 10 : gridSize === 3 ? 50 : 250;
  const diffM = diff === -1 ? 1 : diff === 0 ? 1.5 : 3;
  const modeM = game === 'classic' ? 1 : game === 'diamonds' ? 1.2 : 1.1;
  const currentBase = Math.round(baseP * diffM * modeM);
  const expectedT = gridSize * gridSize * 150;
  const timeFactor = Math.max(0, 1 - (seconds / (expectedT * 2)));
  const timeBonus = Math.round(currentBase * 0.5 * timeFactor);
  const perfectBonus = mistakes === 0 ? Math.round(currentBase * 0.5) : 0;
  const speedBonus = seconds < expectedT ? Math.round(currentBase * 0.5) : 0;
  const liveScore = Math.max(Math.round(currentBase * 0.2), Math.round(currentBase + timeBonus + perfectBonus + speedBonus - (mistakes * 10)));

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SudokuHeader
          theme={theme}
          navigation={navigation}
          difficultyMeta={difficultyMeta}
          totalCells={totalCells}
          seconds={seconds}
          progress={progress}
          score={liveScore}
        />

        <View style={styles.boardWrap}>
          <Board
            board={boardWithStatus}
            initialBoard={initialBoard}
            setSelectedCell={setSelectedCell}
            gridSize={gridSize}
            game={game}
            selectedRowIndex={selectedRowIndex}
            selectedColIndex={selectedColIndex}
          />
        </View>

        <SudokuKeypad
          theme={theme}
          gameMode={gameMode}
          totalCells={totalCells}
          pickerGap={pickerGap}
          btnSize={btnSize}
          btnFontSize={btnFontSize}
          isNoteMode={isNoteMode}
          setIsNoteMode={setIsNoteMode}
          hapticsEnabled={hapticsEnabled}
          hapticOptions={hapticOptions}
          selectedNumber={selectedNumber}
          onNumberPress={handleNumberPress}
        />

        <View style={styles.utilityRow}>
          <GameButton
            title={isNoteMode ? 'Notes On' : 'Notes Off'}
            icon="✎"
            variant={isNoteMode ? 'accent' : 'secondary'}
            onPress={() => setIsNoteMode(current => !current)}
            style={styles.utilityButton}
          />
          <GameButton
            title="Hint Check"
            icon="👁"
            variant="secondary"
            onPress={openCheckModal}
            style={styles.utilityButton}
            showBadge={!hintsEnabled && diff !== 1}
            badgeColor={theme.primary}
          />
        </View>

        <SubmitBoard onCheck={openCheckModal} onClear={openClearModal} onReload={openReloadModal} />
      </ScrollView>

      <PopupModal
        visible={modalConfig.visible}
        icon={modalConfig.icon}
        title={modalConfig.title}
        message={modalConfig.message}
        chips={modalConfig.chips}
        actions={modalConfig.actions || []}
        onDismiss={closeModal}
      />
      <Errors error={status.message} type={status.type} />
    </View>
  );
};

export default Sudoku;
