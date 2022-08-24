const clear = require("clear");
const c = require("./connectmoji.js");
const readlineSync = require("readline-sync");

const [PLAYER, COMPUTER] = [0, 1];
// TODO: assume that a dropPiece helper function exists that
// places a piece in the top most empty cell of the column
// represented by letter
//
// implement with getEmptyRowCol and setCell) using this
// signature: dropPiece(board, val, letter)

function dropPicece(board, val, letter) {}

function play(gameData) {
  let { board, winner, turn } = gameData;
  const { consecutive, pieces } = gameData;

  readlineSync.question("Press <ENTER> to start game");

  clear();
  console.log(c.boardToString(board));

  let boardFull = c.getAvailableColumns(board).length === 0;
  while (winner === undefined && !boardFull) {
    let letter;
    if (turn === PLAYER) {
    } else if (turn === COMPUTER) {
      // TODO: choose a move for the computer (can be random, but
      // must be valid) and save to letter
    }
    clear();

    // TODO: play the move using the letter produced from
    // conditional above

    turn = (turn + 1) % 2;
    boardFull = c.getAvailableColumns(board).length === 0;
    if (c.hasConsecutiveValues(board, row, col, +consecutive)) {
      winner = c.getVal(board, row, col);
      break;
    }
  }
  if (winner !== undefined) {
    console.log("Winner is", winner);
  } else {
    console.log("No winner. So sad 😭");
  }
}

function setup(config) {
  let board;
  let winner;
  let rows;
  let cols;
  let consecutive;
  let turn;
  let pieces;

  if (config !== undefined) {
    // TODO: use the supplied configuration to autoplay
    const movePath = config[1];
    const movePathArr = [...movePath];
    pieces = [movePathArr[0], movePathArr[2]];
    rows = parseInt(config[2]);
    cols = parseInt(config[3]);
    consecutive = parseInt(config[4]);
    board = c.generateBoard(rows, cols);
    const autoOutcome = c.autoplay(board, movePath, consecutive);
    winner = autoOutcome.winner;
    turn = 0;
  } else {
    // TODO: otherwise, ask the user to enter configuration options
    // * rows, cols, consecutive pieces
    // * the characters to use
    // * determine who goes first

    const askRCC =
      readlineSync.question(`Enter the number of rows, columns, and consecutive "pieces" for win
all separated by commas...for example: 6,7,4\n> `);
    const dataArr = askRCC.split(",");
    rows = parseInt(dataArr[0]);
    cols = parseInt(dataArr[1]);
    consecutive = parseInt(dataArr[2]);
    console.log("Using row, col and consecutive: ", rows, cols, consecutive);

    const askChar =
      readlineSync.question(`Enter two characters that represent the player and computer
(separated by a comma... for example: P,C)\n> `);
    let player, comp;
    if (askChar.length === 0) {
      player = "😎";
      comp = "💻";
    } else {
      const charArr = askChar.split(",");
      player = charArr[0];
      comp = charArr[1];
    }
    console.log("Using player and computer characters:", player, comp);

    let defultP;
    const first = readlineSync.question(
      `Who goes first, (P)layer or (C)omputer?\n> `
    );

    if (
      first.length > 1 ||
      first.length === 0 ||
      (first !== "P" && first !== "C")
    ) {
      console.log("Invalid input, default first turn goes to Player");
      defultP = "P";
    } else if (first === "P") {
      turn = 0;
      console.log("Player goes first");
    } else {
      turn = 1;
      console.log("Computer goes first");
    }

    if (defultP === "P") {
      turn = 0;
      console.log("Player goes first");
    }
    return { board, winner, consecutive, turn, pieces };
  }

  function processArgs() {
    let config;
    if (process.argv[2]) {
      const args = process.argv[2].split(",");
      const [player, moves, rows, cols, consecutive] = args;
      config = { player, moves, rows, cols, consecutive };
    }
    return config;
  }

  function main() {
    // game is object that configures the game play
    // such as  the board, the current turn, etc.
    const game = setup(processArgs());
    play(game);
  }
}
