let currentRandom = Math.random;

export const setSeed = (seed) => {
    if (seed === null || seed === undefined) {
        currentRandom = Math.random;
        return;
    }
    
    // Simple seeded RNG
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;

    currentRandom = () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
};

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(currentRandom() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const isValid = (board, row, col, num, gridSize) => {
    const gridSizeScale = gridSize * gridSize;
    // Row and Column check
    for (let i = 0; i < gridSizeScale; i++) {
        if (board[row][i] === num || board[i][col] === num) {return false;}
    }
    // Subgrid check
    const startRow = row - (row % gridSize);
    const startCol = col - (col % gridSize);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[startRow + i][startCol + j] === num) {return false;}
        }
    }
    return true;
};

export const fillBoard = (board, row, col, gridSize) => {
    const gridSizeScale = gridSize * gridSize;
    if (row === gridSizeScale) {return true;}  // Base case for row
    if (col === gridSizeScale) {return fillBoard(board, row + 1, 0, gridSize);}  // Move to next row

    const numbers = shuffleArray(Array.from({ length: gridSizeScale }, (_, index) => index + 1));
    for (let num of numbers) {
        if (isValid(board, row, col, num, gridSize)) {
            board[row][col] = num;
            if (fillBoard(board, row, col + 1, gridSize)) {return true;}
            board[row][col] = 0;  // Backtrack
        }
    }
    return false;  // Trigger backtracking
};

export const generateFullBoard = (gridSize) => {
    const gridSizeScale = gridSize * gridSize;
    let board = Array.from({ length: gridSizeScale }, () => Array(gridSizeScale).fill(0));
    fillBoard(board, 0, 0, gridSize);
    return board;
};

export const removeCells = (board, gridSize, diff) => {
    const gridSizeScale = gridSize * gridSize;
    const gridScale = gridSize * gridSize * gridSize * gridSize;
    let remainingCells = gridScale;

    // Adjust for difficulty
    const cellsToRemove = Math.floor(currentRandom() * 10) +
        (diff !== 0 ? (diff > 0 ? Math.round(gridScale * 0.7) : Math.round(gridScale * 0.3)) : Math.round(gridScale * 0.5));

    while (remainingCells > gridScale - cellsToRemove) {
        let row = Math.floor(currentRandom() * gridSizeScale);
        let col = Math.floor(currentRandom() * gridSizeScale);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            remainingCells--;
        }
    }
};

export const initializeBoard = (gridSize, diff, seed = null) => {
    if (seed !== null) {
        setSeed(seed);
    }
    let board = generateFullBoard(gridSize);
    removeCells(board, gridSize, diff);
    // Reset seed to Math.random after generation to avoid affecting other logic
    if (seed !== null) {
        setSeed(null);
    }
    return board;
};

export const findBlank = (board, gridSize) => {
    const gridSizeScale = gridSize * gridSize;
    for (let i = 0; i < gridSizeScale; i++) {
        for (let a = 0; a < gridSizeScale; a++) {
            if (board[i][a] === 0) {
                return [i, a];
            }
        }
    }
    return null; // No blank cells
};

export const solveBoard = (board, gridSize) => {
    const blank = findBlank(board, gridSize);
    if (!blank) return true; // no empty cells — solved

    const [row, col] = blank;
    const gridSizeScale = gridSize * gridSize;

    for (let n = 1; n <= gridSizeScale; n++) {
        if (isValid(board, row, col, n, gridSize)) {
            board[row][col] = n;
            if (solveBoard(board, gridSize)) return true;
            board[row][col] = 0; // backtrack
        }
    }

    return false; // trigger backtracking in caller
};

export const checkBoardValid = (board, gridSize) => {
    const gridSizeScale = gridSize * gridSize;

    for (let row = 0; row < gridSizeScale; row++) {
        for (let col = 0; col < gridSizeScale; col++) {
            const cellValue = board[row][col];
            if (cellValue !== 0) {
                board[row][col] = 0;
                const isValidCell = isValid(board, row, col, cellValue, gridSize);
                board[row][col] = cellValue;
                if (!isValidCell) {
                    return false;
                }
            }
        }
    }
    return true;
};

export const checkIsBoardFull = (board, gridSize) => {
    const gridSizeScale = gridSize * gridSize;
    for (let row = 0; row < gridSizeScale; row++) {
        for (let col = 0; col < gridSizeScale; col++) {
            if (board[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
};
