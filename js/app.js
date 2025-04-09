document.addEventListener('DOMContentLoaded', function() {
  let randomNumber = generateRandomNumber();
  let attempts = 0;
  let score = 10;
  let maxAttempts = 10;
  let guessHistory = [];
  let gameOver = false;

  const guessInput = document.getElementById('guessInput');
  const checkButton = document.getElementById('checkButton');
  const resetButton = document.getElementById('resetButton');
  const feedbackElement = document.getElementById('feedback');
  const validationErrorElement = document.getElementById('validationError');
  const attemptsElement = document.getElementById('attempts');
  const scoreElement = document.getElementById('score');
  const historyListElement = document.getElementById('historyList');
  const maxAttemptsElement = document.getElementById('maxAttempts');

  maxAttemptsElement.textContent = maxAttempts;

  checkButton.addEventListener('click', checkGuess);
  resetButton.addEventListener('click', resetGame);

  // რენდომ რიცხვის გენერაცია
  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function checkGuess() {
    if (gameOver) {
      return;
    }

    const userGuess = parseInt(guessInput.value);

    // ვალიდაცია რომელი უნდა იყოს 1-დან 100-მდე
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      validationErrorElement.textContent = 'Please enter a number between 1 and 100!';
      return;
    }

    validationErrorElement.textContent = '';
    attempts++;
    attemptsElement.textContent = attempts;

    let feedback = '';
    let resultText = '';
    let icon = '';

    if (userGuess === randomNumber) {
      feedback = '🎉 Correct!';
      resultText = '&nbsp;&nbsp;(Correct)';
      gameOver = true;
      guessInput.disabled = true;
      checkButton.disabled = true;
    } else if (userGuess < randomNumber) {
      feedback = '📈 Too low!';
      resultText = '&nbsp;&nbsp;(Too low)';
      score -= 1;
    } else {
      feedback = '📉 Too high!';
      resultText = '&nbsp;&nbsp;(Too high)';
      score -= 1;
    }

    feedbackElement.textContent = feedback;
    scoreElement.textContent = score;

    addToHistory(userGuess, resultText);

    guessInput.value = '';
    guessInput.focus();

    // აქ ვამოწმებთ რომ მაქსიმალური მცდელობები არ გადაცდეს
    if (attempts >= maxAttempts && !gameOver) {
      feedbackElement.textContent = '💥 Game Over!';
      validationErrorElement.textContent = `The number was ${randomNumber}`;
      gameOver = true;
      guessInput.disabled = true;
      checkButton.disabled = true;
    }
  }

  // ისტორიაში ახალი ელემენტის დამატება
  function addToHistory(guess, result) {
    guessHistory.push({ guess, result });

    const historyItem = document.createElement('li');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `<span class="guess-number">${guess}</span> <span class="guess-result">${result}</span>`;

    historyListElement.prepend(historyItem);
  }

  // დავარესტარტოთ თამაში
  function resetGame() {
    randomNumber = generateRandomNumber();
    attempts = 0;
    score = 10;
    guessHistory = [];
    gameOver = false;

    guessInput.disabled = false;
    checkButton.disabled = false;
    guessInput.value = '';
    feedbackElement.textContent = '🧠 ?';
    validationErrorElement.textContent = '';
    attemptsElement.textContent = '0';
    scoreElement.textContent = '10';

    historyListElement.innerHTML = '';

    guessInput.focus();
  }
});
