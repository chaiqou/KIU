document.addEventListener('DOMContentLoaded', function() {
  const registrationContainer = document.getElementById('registrationContainer'); // Gets the element with id="registrationContainer"
  const gameContainer = document.getElementById('gameContainer'); // Tries to get element with id="gameContainer"
  const submitBtn = document.getElementById('submitBtn');



  submitBtn.addEventListener('click', function() {
    clearErrors();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const technologies = document.querySelectorAll('input[name="technology"]:checked');

    let isValid = true;

    if (!firstName) {
      showError('firstNameError', 'First name is required');
      isValid = false;
    }

    if (!lastName) {
      showError('lastNameError', 'Last name is required');
      isValid = false;
    }

    if (!email) {
      showError('emailError', 'Email is required');
      isValid = false;
    }

    if (!password) {
      showError('passwordError', 'Password is required');
      isValid = false;
    }

    if (email && !validateEmail(email)) {
      showError('emailError', 'Please enter a valid email address');
      isValid = false;
    }

    if (password && password.length < 8) {
      showError('passwordError', 'Password must be at least 8 characters long');
      isValid = false;
    }

    if (technologies.length < 3) {
      showError('technologiesError', 'Please select at least 3 technologies');
      isValid = false;
    }

    if (isValid) {
      registrationContainer.style.display = 'none';
      gameContainer.style.display = 'block';
      initializeGame();
    }
  });

  function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
      element.textContent = '';
    });
  }

  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  let randomNumber;
  let attempts;
  let score;
  let guessHistory;
  let maxAttempts = 10;
  let gameEnded = false;

  const guessInput = document.getElementById('guessInput');
  const checkButton = document.getElementById('checkButton');
  const resetButton = document.getElementById('resetButton');
  const feedbackElement = document.getElementById('feedback');
  const validationErrorElement = document.getElementById('validationError');
  const attemptsElement = document.getElementById('attempts');
  const scoreElement = document.getElementById('score');
  const historyListElement = document.getElementById('historyList');

  function initializeGame() {
    randomNumber = generateRandomNumber();
    attempts = 0;
    score = 10;
    guessHistory = [];
    gameEnded = false;

    guessInput.value = '';
    guessInput.disabled = false;
    checkButton.disabled = false;
    feedbackElement.textContent = '?';
    validationErrorElement.textContent = '';
    attemptsElement.textContent = '0';
    scoreElement.textContent = '10';
    historyListElement.innerHTML = '';

    checkButton.addEventListener('click', checkGuess);
    resetButton.addEventListener('click', resetGame);
    guessInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        checkGuess();
      }
    });
  }

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function checkGuess() {
    if (gameEnded) return;

    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      validationErrorElement.textContent = 'Please enter a valid number between 1 and 100.';
      return;
    }

    validationErrorElement.textContent = '';
    attempts++;
    attemptsElement.textContent = attempts;

    let feedback = '';
    let resultText = '';
    let icon = '';

    if (userGuess === randomNumber) {
      feedback = 'Correct!';
      resultText = 'Correct!';
      icon = '🎉';
      gameEnded = true;
      guessInput.disabled = true;
      checkButton.disabled = true;
    } else if (userGuess < randomNumber) {
      feedback = 'Too low!';
      resultText = 'Too low';
      icon = '📈';
      score -= 1;
    } else {
      feedback = 'Too high!';
      resultText = 'Too high';
      icon = '📉';
      score -= 1;
    }

    feedbackElement.textContent = feedback;
    if (icon) {
      feedbackElement.innerHTML = `${icon} ${feedback}`;
    }
    scoreElement.textContent = score;

    addToHistory(userGuess, resultText);

    guessInput.value = '';
    guessInput.focus();

    if (attempts >= maxAttempts && userGuess !== randomNumber) {
      feedbackElement.innerHTML = '💥 Game Over!';
      gameEnded = true;
      guessInput.disabled = true;
      checkButton.disabled = true;
    }
  }

  function addToHistory(guess, result) {
    guessHistory.push({ guess, result });

    const historyItem = document.createElement('li');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `<span class="guess-number">${guess}</span> <span class="guess-result">${result}</span>`;

    historyListElement.prepend(historyItem);
  }

  function resetGame() {
    randomNumber = generateRandomNumber();
    attempts = 0;
    score = 10;
    guessHistory = [];
    gameEnded = false;

    guessInput.disabled = false;
    checkButton.disabled = false;
    guessInput.value = '';
    feedbackElement.textContent = '?';
    validationErrorElement.textContent = '';
    attemptsElement.textContent = '0';
    scoreElement.textContent = '10';

    historyListElement.innerHTML = '';

    guessInput.focus();
  }
});
