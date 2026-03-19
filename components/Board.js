import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Square from './Square';
import { ThemeContext } from '../utils/ThemeContext';

const SCREEN_PADDING = 26;
const BOARD_BORDER = 3;

const Board = ({
  board,
  initialBoard,
  setSelectedCell,
  gridSize,
  game,
  selectedRowIndex,
  selectedColIndex,
}) => {
  const { theme } = useContext(ThemeContext);
  const { width: screenWidth } = useWindowDimensions();

  const totalCells = gridSize * gridSize;
  const availableWidth = Math.min(screenWidth - SCREEN_PADDING, 420);
  const cellSize = Math.floor((availableWidth - BOARD_BORDER * 2) / totalCells);
  const boardSize = cellSize * totalCells + BOARD_BORDER * 2;
  const fontSize = Math.max(10, Math.min(22, Math.floor(cellSize * 0.54)));

  // Static background layer: only changes when a new puzzle is generated.
  // Uses initialBoard (stable during gameplay) so entering numbers never triggers a recalc here.
  const cellBg = useMemo(() => {
    const bgViews = [];
    for (let r = 0; r < totalCells; r += 1) {
      for (let c = 0; c < totalCells; c += 1) {
        const isPreGen = (initialBoard[r]?.[c] ?? 0) !== 0;
        bgViews.push(
          <View
            key={`bg-${r}-${c}`}
            style={{
              position: 'absolute',
              top: r * cellSize,
              left: c * cellSize,
              width: cellSize,
              height: cellSize,
              backgroundColor: isPreGen
                ? theme.generatedCellBackground
                : theme.cellBackground,
            }}
          />,
        );
      }
    }
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {bgViews}
      </View>
    );
  }, [initialBoard, cellSize, totalCells, theme.generatedCellBackground, theme.cellBackground]);

  // Highlight overlay layer: only 4 absolute Views — only updates when selection changes.
  // This is the key optimisation: tapping a cell costs ~4 native view updates instead of ~40.
  const highlights = useMemo(() => {
    if (selectedRowIndex === null || selectedColIndex === null) {
      return null;
    }
    const blockRowStart = Math.floor(selectedRowIndex / gridSize) * gridSize;
    const blockColStart = Math.floor(selectedColIndex / gridSize) * gridSize;
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {/* Same block */}
        <View
          style={{
            position: 'absolute',
            top: blockRowStart * cellSize,
            left: blockColStart * cellSize,
            width: gridSize * cellSize,
            height: gridSize * cellSize,
            backgroundColor: theme.highlightBackground,
          }}
        />
        {/* Same row */}
        <View
          style={{
            position: 'absolute',
            top: selectedRowIndex * cellSize,
            left: 0,
            width: totalCells * cellSize,
            height: cellSize,
            backgroundColor: theme.primarySoft,
          }}
        />
        {/* Same column */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: selectedColIndex * cellSize,
            width: cellSize,
            height: totalCells * cellSize,
            backgroundColor: theme.primarySoft,
          }}
        />
        {/* Selected cell */}
        <View
          style={{
            position: 'absolute',
            top: selectedRowIndex * cellSize + 1,
            left: selectedColIndex * cellSize + 1,
            width: cellSize - 2,
            height: cellSize - 2,
            backgroundColor: theme.secondarySoft,
            borderWidth: 2,
            borderRadius: 5,
            borderColor: theme.selectedBorder,
          }}
        />
      </View>
    );
  }, [
    selectedRowIndex,
    selectedColIndex,
    cellSize,
    gridSize,
    totalCells,
    theme.highlightBackground,
    theme.primarySoft,
    theme.secondarySoft,
    theme.selectedBorder,
  ]);

  // Cell content layer: only changes when board values or notes change.
  // NO dependency on selectedRowIndex / selectedColIndex — tapping a cell does NOT
  // trigger a cells recompute or any Square re-render.
  const cells = useMemo(() => {
    const renderedCells = [];

    for (let rowIndex = 0; rowIndex < totalCells; rowIndex += 1) {
      for (let colIndex = 0; colIndex < totalCells; colIndex += 1) {
        const cellData = board[rowIndex]?.[colIndex] || {
          value: null,
          isPreGenerated: false,
          notes: [],
        };

        renderedCells.push(
          <View
            key={`${rowIndex}-${colIndex}`}
            style={[
              styles.cellWrap,
              {
                width: cellSize,
                height: cellSize,
                borderRightWidth: colIndex === totalCells - 1 ? 0 : colIndex % gridSize === gridSize - 1 ? 2 : 1,
                borderBottomWidth: rowIndex === totalCells - 1 ? 0 : rowIndex % gridSize === gridSize - 1 ? 2 : 1,
                borderRightColor: colIndex % gridSize === gridSize - 1 ? theme.borderStrong : theme.border,
                borderBottomColor: rowIndex % gridSize === gridSize - 1 ? theme.borderStrong : theme.border,
              },
            ]}
          >
            <Square
              value={cellData.value}
              onPress={setSelectedCell}
              isPreGenerated={cellData.isPreGenerated}
              size={fontSize}
              game={game}
              notes={cellData.notes}
              rowIndex={rowIndex}
              colIndex={colIndex}
              gridScale={totalCells}
              textColor={theme.text}
              userTextColor={theme.primaryDark}
              noteColor={theme.subText}
            />
          </View>,
        );
      }
    }

    return renderedCells;
  }, [
    board,
    cellSize,
    fontSize,
    game,
    gridSize,
    setSelectedCell,
    theme.border,
    theme.borderStrong,
    theme.text,
    theme.primaryDark,
    theme.subText,
    totalCells,
  ]);

  return (
    <View
      style={[
        styles.board,
        {
          width: boardSize,
          height: boardSize,
          backgroundColor: theme.gridBackground,
          borderColor: theme.borderStrong,
          shadowColor: theme.shadow,
        },
      ]}
    >
      {/* Render order: cell backgrounds → highlights → cell content → glow */}
      {cellBg}
      {highlights}
      {cells}
      <View pointerEvents="none" style={[styles.boardGlow, { backgroundColor: theme.textureTint }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: 24,
    borderWidth: BOARD_BORDER,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 7,
  },
  boardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '22%',
  },
  cellWrap: {
    overflow: 'hidden',
  },
});

export default Board;
