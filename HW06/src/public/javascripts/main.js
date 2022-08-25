const faceValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
const suits = ['♦', '♣', '♥', '♠'];

let currCompScore = 0;
let currPlayerScore = 0;

let compAce = 0;
let playerAce = 0;

const TARGET_SCORE = 21;
const specialValue = {J: 10, Q: 10, K: 10, A: 11};

document.addEventListener('DOMContentLoaded', main);

function main() {
  const startForm = document.querySelector('.start');
  const startInput = document.querySelector('.start input');
  const startBtn = document.querySelector('.playBtn');

  startBtn.addEventListener('click', onStartGame);

  function onStartGame(event) {
    event.preventDefault();
    startForm.classList.add('hidden');
    const initialValues = startInput.value.split(',');
    let cardsToCreate = 0;
    // When user put nothing on Start Values, initialValues.length is 1 ([''])
    if (initialValues.length === 1) {
      cardsToCreate = 52;
    } else {
      cardsToCreate = 52 - initialValues.length;
    }
    const deck = createDeck(initialValues, cardsToCreate);

    // Create HTML elements
    const game = document.querySelector('.game');
    const compCardBox = document.createElement('div');
    const compScore = document.createElement('div');
    compScore.innerHTML = 'Computer hand - Total: <span id="comp-score">?</span>';
    const playerCardBox = document.createElement('div');
    const playerScore = document.createElement('div');
    playerScore.innerHTML = 'Player hand - Total: <span id="player-score"></span>';

    // Add Class name
    compCardBox.classList.add('comp-card-box');
    compScore.classList.add('comp-score');
    playerCardBox.classList.add('player-card-box');
    playerScore.classList.add('player-score');

    // Create HTML elements
    const hitBtn = document.createElement('button');
    const standBtn = document.createElement('button');

    // Add Class name
    hitBtn.classList.add('hit-btn');
    standBtn.classList.add('stand-btn');

    hitBtn.textContent = 'Hit';
    standBtn.textContent = 'Stand';

    const resultBox = document.createElement('div');
    const result = document.createElement('span');
    resultBox.appendChild(result);

    resultBox.classList.add('result-Box');
    result.classList.add('result');

    const restartBox = document.createElement('div');
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBox.appendChild(restartBtn);

    restartBox.classList.add('restart-box');
    restartBtn.classList.add('restart-button', 'hidden');

    const saveForm = document.createElement('form');
    saveForm.method = 'POST';
    saveForm.innerHTML += '<input type="text" name="playerInitial" placeholder="Please Enter Your Enitial" />';
    saveForm.innerHTML += '<input id="save-player-score" type="number" name="playerScore" readonly />';
    saveForm.innerHTML += '<input type="text" name="comp" value="Computer" readonly />';
    saveForm.innerHTML += '<input id="save-comp-score" type="number" name="compScore" readonly />';
    saveForm.innerHTML += '<input value="Submit" type="submit" />';

    saveForm.classList.add('save-form', 'hidden');

    //Add into HTML source
    game.appendChild(compCardBox);
    game.appendChild(compScore);
    game.appendChild(playerCardBox);
    game.appendChild(playerScore);
    game.appendChild(hitBtn);
    game.appendChild(standBtn);
    game.appendChild(resultBox);
    game.appendChild(restartBox);
    game.appendChild(saveForm);

    const card1 = dealCard(deck);
    const card2 = dealCard(deck);
    const card3 = dealCard(deck);
    const card4 = dealCard(deck);

    // Deal the initial cards. Two cards for each player
    addCardVal(compCardBox, 'computer', card1);
    currCompScore = reduceAce(currCompScore, 'computer');
    addCardVal(playerCardBox, 'player', card2);
    currPlayerScore = reduceAce(currPlayerScore, 'player');
    addCardVal(compCardBox, 'computer', card3);
    currCompScore = reduceAce(currCompScore, 'computer');
    addCardVal(playerCardBox, 'player', card4);
    currPlayerScore = reduceAce(currPlayerScore, 'player');

    // Show Score
    showPlayerCurrScore();

    // Hidden Computer Side Deck
    const compCards = compCardBox.childNodes;
    compCards[0].classList.add('card-back');

    hitBtn.addEventListener('click', onHitBtn);

    function onHitBtn() {
      const nextCard = dealCard(deck);
      addCardVal(playerCardBox, 'player', nextCard);
      currPlayerScore = reduceAce(currPlayerScore, 'player');
      showPlayerCurrScore();
      if (currPlayerScore > TARGET_SCORE) {
        compCards[0].classList.remove('card-back');
        compCards.forEach(compCard => {
          if (compCard.classList.contains('hidden')) compCard.classList.remove('hidden');
        });
        showCompCurrScore();
        showResult('computer');
        showRestart();
        showSave();
      }
    }

    standBtn.addEventListener('click', onStandBtn);

    function onStandBtn() {
      while (currCompScore < 17) {
        const nextCard = dealCard(deck);
        addCardVal(compCardBox, 'computer', nextCard);
        currCompScore = reduceAce(currCompScore, 'computer');
      }
      if (currCompScore > TARGET_SCORE) {
        showResult('player');
      } else if (currCompScore === TARGET_SCORE) {
        showResult('computer');
      } else if (currCompScore === currPlayerScore) {
        showResult('tie');
      } else if (TARGET_SCORE - currCompScore < TARGET_SCORE - currPlayerScore && currCompScore < TARGET_SCORE) {
        showResult('computer');
      } else if (TARGET_SCORE - currCompScore > TARGET_SCORE - currPlayerScore) {
        showResult('player');
      } else {
        console.log('what is this case?');
      }
      compCards[0].classList.remove('card-back');
      compCards.forEach(compCard => {
        if (compCard.classList.contains('hidden')) compCard.classList.remove('hidden');
      });
      showCompCurrScore();
      showRestart();
      showSave();
    }

    restartBtn.addEventListener('click', onRestartBtn);

    function onRestartBtn() {
      window.location.reload();
    }
  }

  // Create Shuffled Deck
  function createDeck(initialValues, cardsToCreate) {
    let deck = [];
    if (cardsToCreate === 52) {
      for (let i = 0; i < faceValues.length; i++) {
        for (let j = 0; j < suits.length; j++) {
          if (faceValues[i] !== 'J' && faceValues[i] !== 'K' && faceValues[i] !== 'Q' && faceValues[i] !== 'A')
            deck.push({face: parseInt(faceValues[i]), suit: suits[j]});
          else deck.push({face: faceValues[i], suit: suits[j]});
        }
      }
      return shuffleDeck(deck);
    } else {
      let initialDeck = [];
      // Set "Diamond" as default suit
      for (let i = 0; i < initialValues.length; i++) {
        if (
          initialValues[i] !== 'J' &&
          initialValues[i] !== 'K' &&
          initialValues[i] !== 'Q' &&
          initialValues[i] !== 'A'
        )
          initialDeck.push({face: parseInt(initialValues[i]), suit: suits[0]});
        else initialDeck.push({face: initialValues[i], suit: suits[0]});
      }

      for (let i = 0; i < faceValues.length; i++) {
        for (let j = 0; j < suits.length; j++) {
          if (faceValues[i] !== 'J' && faceValues[i] !== 'K' && faceValues[i] !== 'Q' && faceValues[i] !== 'A')
            deck.push({face: parseInt(faceValues[i]), suit: suits[j]});
          else deck.push({face: faceValues[i], suit: suits[j]});
        }
      }

      let shuffledDeck = shuffleDeck(deck);
      let reversedInitDeck = initialDeck.reverse();
      shuffledDeck.push(...reversedInitDeck);
      return shuffledDeck;
    }
  }

  // Shuffle the deck
  function shuffleDeck(deck) {
    let shuffledDeck = deck.slice();
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledDeck[i];
      shuffledDeck[i] = shuffledDeck[j];
      shuffledDeck[j] = temp;
    }
    return shuffledDeck;
  }

  function dealCard(deck) {
    return deck.pop();
  }

  function addCardVal(targetBox, playTurn, card) {
    if (playTurn === 'computer') {
      const cardFig = document.createElement('div');
      cardFig.classList.add('card');
      cardFig.textContent = card.face + ' ' + card.suit;
      targetBox.appendChild(cardFig);
      if (card.face === 'J' || card.face === 'Q' || card.face === 'K') {
        currCompScore += specialValue[card.face];
      } else if (card.face === 'A') {
        currCompScore += specialValue[card.face];
        compAce++;
      } else {
        currCompScore += card.face;
      }
    } else if (playTurn === 'player') {
      const cardFig = document.createElement('div');
      cardFig.classList.add('card');
      cardFig.textContent = card.face + ' ' + card.suit;
      targetBox.appendChild(cardFig);
      if (card.face === 'J' || card.face === 'Q' || card.face === 'K') {
        currPlayerScore += specialValue[card.face];
      } else if (card.face === 'A') {
        currPlayerScore += specialValue[card.face];
        playerAce++;
      } else {
        currPlayerScore += card.face;
      }
    }
  }

  function showPlayerCurrScore() {
    const currScore = document.querySelector('#player-score');
    currScore.textContent = currPlayerScore;
  }

  function showCompCurrScore() {
    const currScore = document.querySelector('#comp-score');
    currScore.textContent = currCompScore;
  }

  function showResult(winner) {
    const result = document.querySelector('.result');
    if (winner === 'player') {
      result.textContent = 'Player Won🙌🙌🙌';
    } else if (winner === 'computer') {
      result.textContent = 'Player Lost😥😥😥';
    } else if (winner === 'tie') {
      result.textContent = 'It is a Tie🤭🤭🤭';
    }
  }

  function showRestart() {
    const hitBtn = document.querySelector('.hit-btn');
    const standBtn = document.querySelector('.stand-btn');
    const restartBtn = document.querySelector('.restart-button');
    hitBtn.classList.add('hidden');
    standBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
  }

  function showSave() {
    const saveForm = document.querySelector('.save-form');
    saveForm.classList.remove('hidden');
    const savePlayerScore = document.querySelector('#save-player-score');
    savePlayerScore.value = currPlayerScore;
    const saveCompScore = document.querySelector('#save-comp-score');
    saveCompScore.value = currCompScore;
  }

  function reduceAce(sum, turn) {
    console.log(`Initial: Sum: ${sum} turn: ${turn}`);
    if (turn === 'computer') {
      if (compAce) {
        while (sum > 21 && compAce > 0) {
          sum -= 10;
          compAce--;
        }
      }
    } else if (turn === 'player') {
      if (playerAce) {
        while (sum > 21 && playerAce > 0) {
          sum -= 10;
          playerAce--;
        }
      }
    }
    return sum;
  }
}
