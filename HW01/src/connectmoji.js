// implement your functions here
// ...don't forget to export functions!
// npx mocha tests/connectmoji-test.js
const wcwidth = require("wcwidth");

function generateBoard(rows, cols, fill) {
  const boardAsArray = {
    data: new Array(rows * cols),
    rows: rows,
    cols: cols,
  };

  if (fill === undefined) {
    boardAsArray.data.fill(null);
  } else {
    boardAsArray.data.fill(fill);
  }

  return boardAsArray;
}

function rowColToIndex(board, row, col) {
  return board.cols * row + col;
}

function indexToRowCol(board, i) {
  const numOfRows = board.rows;
  return {
    row: Math.floor(i / numOfRows),
    col: i % numOfRows,
  };
}

function setCell(board, row, col, value) {
  const newBoard = generateBoard(board.rows, board.cols);
  newBoard.data = board.data.slice();
  newBoard.data[rowColToIndex(board, row, col)] = value;
  return newBoard;
}

function setCells(board, ...moves) {
  const newBoard = generateBoard(board.rows, board.cols, undefined);
  newBoard.data = board.data.slice();
  let i = 0;

  while (i < moves.length) {
    const index = rowColToIndex(board, moves[i].row, moves[i].col);
    newBoard.data[index] = moves[i].val;
    i++;
  }

  return newBoard;
}

function boardToString(board) {
  const data = board.data;
  const cols = board.cols;
  let showedBoard = "";
  let maxEmojiWidth = 0;

  for (let i = 0; i < data.length; i++) {
    const emojiLen = wcwidth(data[i]);
    if (emojiLen > maxEmojiWidth) {
      maxEmojiWidth = emojiLen;
    }
  }

  function lenToString(len) {
    // start with " " because of very last part of padding
    let space = "";
    for (; len > 0; len--) {
      space += " ";
    }
    return space;
  }

  for (let j = 0; j < data.length; j++) {
    const targetEmo = data[j];
    let lastPartSpaceLen = 0;
    if (targetEmo === null || targetEmo === undefined) {
      lastPartSpaceLen = maxEmojiWidth + 1;
      showedBoard += "| " + lenToString(lastPartSpaceLen);
    } else if (wcwidth(targetEmo) < maxEmojiWidth) {
      lastPartSpaceLen = maxEmojiWidth;
      showedBoard += "| " + targetEmo + lenToString(lastPartSpaceLen);
    } else {
      showedBoard += "| " + targetEmo + " ";
    }

    if (j % cols === cols - 1) {
      showedBoard += "|\n";
    }
  }

  let line = "";
  let numberOfLine = maxEmojiWidth + 2;
  while (numberOfLine > 0) {
    line += "-";
    numberOfLine--;
  }

  const lastIndex = cols - 1;

  for (let k = 0; k < cols; k++) {
    if (k === 0) {
      showedBoard += "|";
    } else {
      showedBoard += "+";
    }
    showedBoard += line;
    if (k === lastIndex) {
      showedBoard += "|\n";
    }
  }

  let charUniCode = 65;
  for (let l = 0; l < cols; l++) {
    const neededSpace = maxEmojiWidth;
    showedBoard +=
      "| " + String.fromCharCode(charUniCode) + lenToString(neededSpace);
    if (l === lastIndex) {
      showedBoard += "|";
    }
    charUniCode++;
  }
  return showedBoard;
}

function letterToCol(letter) {
  const letterToInt = letter.charCodeAt(0);
  if (letter.length === 1 && letterToInt >= 65 && letterToInt <= 90) {
    return letterToInt - 65;
  } else {
    return null;
  }
}

function getEmptyRowCol(board, letter, empty) {
  const colIndex = letterToCol(letter);
  const rowLastIndex = board.rows - 1;
  if (colIndex === null || colIndex > board.cols - 1 || empty === null) {
    return null;
  } else {
    for (let r = 0; r <= rowLastIndex; r++) {
      const cellData = board.data[rowColToIndex(board, r, colIndex)];
      if (r === 0 && cellData !== null) {
        return null;
      } else if (cellData !== null) {
        return {
          row: r - 1,
          col: colIndex,
        };
      }
    }
    return {
      row: rowLastIndex,
      col: colIndex,
    };
  }
}

function getAvailableColumns(board) {
  const result = new Array();
  const colNum = board.cols;
  for (let i = 0; i < colNum; i++) {
    const colLetter = String.fromCharCode(65 + i);
    if (getEmptyRowCol(board, colLetter) != null) {
      result.push(colLetter);
    }
  }
  return result;
}

function hasConsecutiveValues(board, row, col, n) {
  const targetValue = board.data[rowColToIndex(board, row, col)];
  const rowLastIndex = board.rows - 1;
  const colLastIndex = board.cols - 1;

  // Vertically - Up
  let ver = 1;
  for (let u = row - 1; u >= 0; u--) {
    const comparedValue = board.data[rowColToIndex(board, u, col)];
    if (comparedValue === targetValue) {
      ver++;
    }
  }

  // Vertically - Down
  for (let d = row + 1; d <= rowLastIndex; d++) {
    const comparedValue = board.data[rowColToIndex(board, d, col)];
    if (comparedValue === targetValue) {
      ver++;
    }
  }

  if (ver === n) {
    return true;
  }

  let hor = 1;
  // Horizentally - Right
  for (let r = col + 1; r <= colLastIndex; r++) {
    const comparedValue = board.data[rowColToIndex(board, row, r)];
    if (comparedValue === targetValue) {
      hor++;
    }
  }

  // Horizentally - Left
  for (let l = col - 1; l >= 0; l--) {
    const comparedValue = board.data[rowColToIndex(board, row, l)];
    if (comparedValue === targetValue) {
      hor++;
    }
  }

  if (hor === n) {
    return true;
  }

  //Diagonally
  let diagon = 1;
  let antiDiagon = 1;
  for (let a = 0; a < board.rows; a++) {
    for (let b = 0; b < board.cols; b++) {
      // Diagonally - get index
      if (a + b === row + col) {
        const comparedValue = board.data[rowColToIndex(board, a, b)];
        const isTargetValue = a === row && b === col;
        if (comparedValue === targetValue && !isTargetValue) {
          diagon++;
        }
      }

      // AntiDiagonally
      if (Math.abs(a - b) === Math.abs(row - col)) {
        const comparedValue = board.data[rowColToIndex(board, a, b)];
        const isTargetValue = a === row && b === col;
        if (comparedValue === targetValue && !isTargetValue) {
          antiDiagon++;
        }
      }
    }
  }

  if (diagon === n || antiDiagon === n) {
    return true;
  }

  return false;
}

function autoplay(board, s, numConsecutive) {
  const result = {};
  result["board"] = board.data;
  const player1 = s.slice(0, 2);
  const player2 = s.slice(2, 4);
  result["pieces"] = [player1, player2];
  const movePath = s.slice(4, s.length);

  if (movePath.length % 2 !== 0) {
    result["lastPieceMoved"] = player1;
  } else {
    result["lastPieceMoved"] = player2;
  }

  let currPlayer = player1;
  for (let i = 0; i < movePath.length; i++) {
    if (i % 2 === 0) {
      currPlayer = player1;
    } else {
      currPlayer = player2;
    }

    const currColLetter = movePath.slice(i, i + 1);
    const currCol = letterToCol(currColLetter);

    // Check whether valid letter
    if (currCol >= board.cols) {
      result["board"] = null;
      result["error"] = {
        num: i + 1,
        val: currPlayer,
        col: currColLetter,
      };
      return result;
    }

    //check whether Col is empty or not
    let check = getEmptyRowCol(board, currColLetter);
    if (check !== null) {
      board = setCell(board, check.row, currCol, currPlayer);
      result["lastPieceMoved"] = currPlayer;
    } else {
      result["board"] = null;
      result["error"] = {
        num: i + 1,
        val: currPlayer,
        col: currColLetter,
      };
      return result;
    }
    if (check !== null) {
      const isFinish = hasConsecutiveValues(
        board,
        check.row,
        currCol,
        numConsecutive
      );
      if (isFinish === true) {
        if (result.winner !== undefined) {
          delete result.winner;
          result["board"] = null;
          result["error"] = { num: i + 1, val: currPlayer, col: currColLetter };
          return result;
        } else {
          result["winner"] = currPlayer;
        }
      }
    }
  }
  result["board"] = board;

  return result;
}

module.exports = {
  generateBoard: generateBoard,
  rowColToIndex: rowColToIndex,
  indexToRowCol: indexToRowCol,
  setCell: setCell,
  setCells: setCells,
  boardToString: boardToString,
  letterToCol: letterToCol,
  getEmptyRowCol: getEmptyRowCol,
  getAvailableColumns: getAvailableColumns,
  hasConsecutiveValues: hasConsecutiveValues,
  autoplay: autoplay,
};
