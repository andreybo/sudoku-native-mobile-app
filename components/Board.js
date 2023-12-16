import React, { Component } from 'react'
import Square from './Square'
import { View, Text, Dimensions } from 'react-native';



export default class Board extends Component {
    constructor(props) {
        super(props);
        const gridSize = this.props.gridSize;
        const game = this.props.game;

        this.state = {
            selected_square_row: undefined,
            selected_square_col_index: undefined,
            selectedGrid: null,
            selectedRowIndex: null,
            selectedColIndex: null,
            gridSize: gridSize,
            game: game,
        };
    }

    onPress = (rowIndex, colIndex) => {
        this.setState({
            selectedRowIndex: rowIndex,
            selectedColIndex: colIndex,
        });

        // Новая строка: использование переданной функции для обработки нажатия на число
        this.props.setSelectedCell(rowIndex, colIndex);
    }
    

    handleNumberPress = (value) => {
        // If the key entered is valid, we change the value of the square in the boards state.
        if(this.state.selected_square_row !== undefined ){
            this.props.changeValueOnBoard(
                value, [this.state.selected_square_row, this.state.selected_square_col_index]
                )
        }
    }

    handleSquareClick = (gridIndex) => {
        this.setState({ selectedGrid: gridIndex });
    };

    renderGrid = (grid, gridIndex) => {

        const gridSize = this.state.gridSize;

        const screenWidth = Dimensions.get('window').width;
        const squareWidth = (screenWidth - 20) /gridSize;
        const cellWidth = (squareWidth / gridSize) - 2;

        const styles = {
            grid: {
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderColor: 'red', // Darker border for the entire 3x3 grid
                width: squareWidth,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
            },
            gridSpecial: {
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderColor: 'red', // Darker border for the entire 3x3 grid
                width: squareWidth,
                backgroundColor: '#F9F9F9',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
            },
            cell: {
                width: cellWidth,
                height: cellWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#F1F5F9',
            },
            selectedCell: {
                width: cellWidth,
                height: cellWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#4EABF4',
            },
            cellGenerated: {
                width: cellWidth,
                height: cellWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#DAE1E9',
            },
            specialCell:{
                width: cellWidth,
                height: cellWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ccc',
                backgroundColor: '#F9F9F9',
            },
            row: {
                flexDirection: 'row',
            },
            highlightedCell: {
                width: cellWidth,
                height: cellWidth,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFEEC',
                borderWidth: 1,
                borderColor: '#DAE1E9'
            },
        };

        let gridStyle = (gridIndex % 2 === 0) ? styles.grid : styles.gridSpecial;
    
        return (
                <View key={gridIndex} style={gridStyle}>
                    {grid.map((cell, cellIndex) => {
                        let rowIndex = Math.floor(gridIndex / gridSize) * gridSize + Math.floor(cellIndex / gridSize);
                        let colIndex = (gridIndex % gridSize) * gridSize + cellIndex % gridSize;
        
                        // Determine the styling based on selection and axis highlighting
                        let isCellSelected = this.state.selectedRowIndex === rowIndex && this.state.selectedColIndex === colIndex;
                        let isSameRow = rowIndex === this.state.selectedRowIndex;
                        let isSameCol = colIndex === this.state.selectedColIndex;
                        let cellStyle = isCellSelected ? styles.selectedCell : (isSameRow || isSameCol) ? styles.highlightedCell : styles.cell;
                        let cellStyleGenerated = isCellSelected ? styles.selectedCell : (isSameRow || isSameCol) ? styles.highlightedCell : styles.cellGenerated;
                        const { value, isPreGenerated } = cell;

                        return (
                            <Square 
                                key={`${gridIndex}-${cellIndex}`}
                                value={cell !== 0 ? cell : ''}
                                style={!isPreGenerated ? cellStyle : cellStyleGenerated}
                                onPress={() => isPreGenerated ? null : this.onPress(rowIndex, colIndex)}
                                isPreGenerated={isPreGenerated}
                                size={gridSize > 3 ? 12 : 18}
                                game={this.state.game}
                            />
                        );
                    })}
                </View>
        );
    }
    
    
    
    
    

    render() {
        const { board, gridSize } = this.props;
        const gridSizeScaled = gridSize * gridSize;

        if (!Array.isArray(board)) {
            return <Text>Loading board...</Text>;
        }
    
        let grids = [];
        for (let i = 0; i < gridSizeScaled; i++) {
            let grid = [];
            for (let j = 0; j < gridSizeScaled; j++) {
                let rowIndex = Math.floor(i / gridSize) * gridSize + Math.floor(j / gridSize);
                let colIndex = (i % gridSize) * gridSize + j % gridSize;
                grid.push(board[rowIndex][colIndex]);
            }
            grids.push(this.renderGrid(grid, i));
        }
    
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {grids}
            </View>
        );
    }
}