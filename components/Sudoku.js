import React, { Component, useEffect } from 'react';
import Board from "./Board";
import SubmitBoard from "./SubmitBoard";
import {View, Text, TouchableOpacity, Alert, Image} from 'react-native'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


class Sudoku extends Component {
    constructor(props) {
        super(props);
        const gridSize = this.props.gridSize;
        const diff = this.props.diff;
        const initialBoard = this.initializeBoard(gridSize, diff);
        const game = this.props.game;
        this.reloadView = this.reloadView.bind(this);
        this.state = {
            board: initialBoard,
            gridSize: gridSize,
            initialBoard: initialBoard, // Make sure this line is included
            selectedNumber: null,
            selectedRowIndex: null,
            game: game,
            selectedColIndex: null,
        };
    }

    reloadView() {
        const gridSize = this.props.gridSize;
        const diff = this.props.diff;
        const initialBoard = this.initializeBoard(gridSize, diff);
    
        this.setState({
            board: initialBoard,
            initialBoard: initialBoard,
            selectedNumber: null,
            selectedRowIndex: null,
            selectedColIndex: null,
        }, () => {
            console.log('New state set:', this.state.board);
        });
    }
    
    initializeBoard = (gridSize, diff) => {
        let board = this.generateFullBoard(gridSize);
        this.removeCells(board, gridSize, diff);
        console.log('Initialized Board:', board);
        return board;
    }

    generateFullBoard = (gridSize) => {
        const gridSizeScale = gridSize * gridSize;
        let board = Array.from({ length: gridSizeScale }, () => Array(gridSizeScale).fill(0));
        this.fillBoard(board, 0, 0, gridSize);
        return board;
    }

    fillBoard = (board, row, col, gridSize) => {
        const gridSizeScale = gridSize * gridSize;
        if (row === gridSizeScale) return true;  // Base case for row
        if (col === gridSizeScale) return this.fillBoard(board, row + 1, 0, gridSize);  // Move to next row
    
        const numbers = this.shuffleArray(Array.from({ length: gridSizeScale }, (_, index) => index + 1));
        for (let num of numbers) {
            if (this.isValid(board, row, col, num, gridSize)) {
                board[row][col] = num;
                if (this.fillBoard(board, row, col + 1, gridSize)) return true;
                board[row][col] = 0;  // Backtrack
            }
        }
        return false;  // Trigger backtracking
    }
    

    shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    removeCells = (board, gridSize, diff) => {
        const gridSizeScale = gridSize * gridSize;
        const gridScale = gridSize * gridSize * gridSize * gridSize;
        let remainingCells = gridScale;
        const cellsToRemove = Math.floor(Math.random() * 10) + (diff != 0 ? diff > 0 ? (Math.round(gridScale*0.7)) : (Math.round(gridScale*0.3)) : Math.round(gridScale*0.5)); // Adjust for difficulty

        while (remainingCells > gridScale - cellsToRemove) {
            let row = Math.floor(Math.random() * gridSizeScale);
            let col = Math.floor(Math.random() * gridSizeScale);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                remainingCells--;
            }
        }
    }

    isValid = (board, row, col, num, gridSize) => {
        const gridSizeScale = gridSize * gridSize;
        // Row and Column check
        for (let i = 0; i < gridSizeScale; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
        }
        // Subgrid check
        const startRow = row - row % gridSize;
        const startCol = col - col % gridSize;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }
    
    
    solve = () => {
        const gridSize = this.state.gridSize;
        const boardCopy = this.state.board.map(row => [...row]);
        if (this.solveBoard(boardCopy, gridSize)) {
            this.setState({ board: boardCopy });
            return true;
        }
        return false;
    }

    solveBoard = (board, gridSize) => {
        const gridSizeScale = gridSize * gridSize;
        let stack = [{ board, row: 0, col: 0, num: 1 }];
        
        while (stack.length > 0) {
            let { board, row, col, num } = stack.pop();
    
            // Find next empty cell and update row, col
            const [nextRow, nextCol] = this.findBlank(board, gridSize);
            row = nextRow;
            col = nextCol;
    
            for (let n = num; n <= gridSizeScale; n++) {
                if (this.isValid(board, row, col, n, gridSize)) {
                    board[row][col] = n;
                    stack.push({ board: [...board.map(row => [...row])], row, col, num: n + 1 });
                    break;
                }
            }
    
            // Check if the board is solved
            if (row === (gridSizeScale - 1) && col === (gridSizeScale - 1)) {
                return true;
            }
        }
    
        return false; // No solution found
    }

    findBlank = (board, gridSize) => {
        const gridSizeScale = gridSize * gridSize;
        for (let i = 0; i < gridSizeScale; i++) {
            for (let a = 0; a < gridSizeScale; a++) {
                if (board[i][a] === 0) { 
                    return [i, a];
                }
            }
        }
        return null; // No blank cells
    }

    boardValid = () => {
        const { gridSize, board } = this.state;
        const gridSizeScale = gridSize * gridSize;
    
        for (let row = 0; row < gridSizeScale; row++) {
            for (let col = 0; col < gridSizeScale; col++) {
                const cellValue = board[row][col];
                if (cellValue !== 0) {
                    board[row][col] = 0;
                    const isValidCell = this.isValid(board, row, col, cellValue, gridSize);
                    board[row][col] = cellValue;
                    if (!isValidCell) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    isBoardFull = () => {
        const { gridSize, board } = this.state;
        const gridSizeScale = gridSize * gridSize;
    
        for (let row = 0; row < gridSizeScale; row++) {
            for (let col = 0; col < gridSizeScale; col++) {
                if (board[row][col] === 0) {
                    return false;  // Found an empty cell
                }
            }
        }
        return true;  // No empty cells found
    }
    
    
    
    
    changeBoard = (n, index) => {
        this.setState(prevState => {
            const newBoard = [...prevState.board];
            newBoard[index[0]][index[1]] = n;
            return { board: newBoard };
        });
    }

    changeValueOnBoard = (value, rowIndex, colIndex) => {
        this.setState(prevState => {
            const newBoard = prevState.board.map((row, rIndex) => 
                rIndex === rowIndex ? row.map((cell, cIndex) => 
                    cIndex === colIndex ? value : cell) : row
            );
            return { board: newBoard };
        }, () => {
            // After state update, check if the board is fully filled
            if (this.isBoardFull()) {
                // If the board is full, then check if it's valid
                if (this.boardValid()) {
                    this.showWinningMessage("You Win!");
                } else {
                    this.showWinningMessage("You Lose.");
                }
            }
        });
    }
    

    showWinningMessage = (message) => {
        Alert.alert(message);
    }

    clear = () => {
        const { gridSize } = this.state;
        this.setState({
            board: Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0))
        });
    }

    clearUserInputs = () => {
        this.setState({
            board: this.state.initialBoard.map(row => [...row])
        });
    }

    handleNumberPress = (n) => {
        const { selectedRowIndex, selectedColIndex } = this.state;
        if (selectedRowIndex !== null && selectedColIndex !== null) {
            const valueToDelete = n === null ? 0 : n; // Если n равно null, используйте 0 или другое значение, указывающее на пустую ячейку
            this.changeValueOnBoard(valueToDelete, selectedRowIndex, selectedColIndex);
        }
    }
    setSelectedCell = (rowIndex, colIndex) => {
        this.setState({
            selectedRowIndex: rowIndex,
            selectedColIndex: colIndex,
        });
    }
    

    renderGrid = () => {
        const { board, initialBoard } = this.state;
        const { gridSize } = this.state;
    
        // Создаем новый массив с дополнительной информацией
        const boardWithStatus = board.map((row, rowIndex) =>
            row.map((cell, colIndex) => ({
                value: cell > 0 ? cell : null,
                isPreGenerated: initialBoard[rowIndex][colIndex] !== 0
            }))
        );
        return (
            <View style={styles.gridInner}>
                <Board
                    board={boardWithStatus}
                    changeValueOnBoard={this.changeValueOnBoard}
                    selectedNumber={this.state.selectedNumber}
                    setSelectedCell={this.setSelectedCell}
                    gridSize={gridSize}
                    game={this.state.game}
                />
            </View>
        );
    }

    renderNumberSelectionRow = () => {
        const { gridSize } = this.state;
        const gridScale = gridSize * gridSize;
        

        const stylesBtn = {
            centerNumbers: {
                justifyContent: "center",
                alignItems: "center"
            },

            btnNumber: {
                width: gridSize > 3 ? 40 : 50,
                aspectRatio: 1,
                backgroundColor: "#ECF6FF",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
            },

            numberRow: {
                marginBottom: 20,
                marginTop: 20,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 15,
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 10,
                paddingRight: 10,
            },
        
            textStyle: {
                fontSize: 21,
                color: "#4EABF4",
            },
        };

        const images = {
            0: require('../assets/games/eggs/d0.png'),
            1: require('../assets/games/eggs/d1.png'),
            2: require('../assets/games/eggs/d2.png'),
            3: require('../assets/games/eggs/d3.png'),
            4: require('../assets/games/eggs/d4.png'),
            5: require('../assets/games/eggs/d5.png'),
            6: require('../assets/games/eggs/d6.png'),
            7: require('../assets/games/eggs/d7.png'),
            8: require('../assets/games/eggs/d8.png'),
            9: require('../assets/games/eggs/d9.png'),
          };

        return (
            <View style={stylesBtn.centerNumbers}>
                <View style={stylesBtn.numberRow}>
                    {[...Array(gridScale).keys()].map(n => (
                        <TouchableOpacity
                            key={uuidv4()}
                            style={stylesBtn.btnNumber}
                            onPress={() => this.handleNumberPress(n + 1)}
                        >
                            { this.state.game === 'eggs' && images[n + 1] ? 
                                <Image 
                                source={images[n + 1]}
                                style={{ width: '90%', height: '90%' }}
                                />
                            :
                                <Text style={stylesBtn.textStyle}>{n + 1}</Text>
                            }
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        key={uuidv4()}
                        style={stylesBtn.btnNumber}
                        onPress={() => this.handleNumberPress(null)} // Или используйте 0 в зависимости от логики обработки
                    >
                        <Text style={stylesBtn.textStyle}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    

    render() {
        return (
            <View style={styles.boardPos}>
                {this.renderGrid()}
                {this.renderNumberSelectionRow()}
                {!this.isBoardFull() && (
                    <SubmitBoard 
                        solve={this.solve} 
                        valid={this.boardValid}
                        reload={this.reloadView}
                        clearUserInputs={this.clearUserInputs}
                    />
                )}
            </View>
        );
    }
}

const styles = {
    boardPos: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection:'column',
        flexWrap:'wrap',
        backgroundColor: "#fff",
        height: '100%',
    },
    gridInner:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
    rowStyle:{
        flexDirection: 'row',
    },
    centerNumbers:{
        justifyContent: "center",
        alignItems: "center",
    },
};

export default Sudoku;
