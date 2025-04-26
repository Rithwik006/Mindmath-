let generatedOTP = '';
let userName = '';
let score = 0;
let timeLeft = 10;
let timer;
let difficulty = 1;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function sendOTP() {
  userName = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!userName || !email) {
    alert('Please fill in all fields!');
    return;
  }

  generatedOTP = Math.floor(1000 + Math.random() * 9000); // Random 4-digit OTP
  console.log("Simulated OTP (for demo):", generatedOTP); // Show OTP in console

  alert(`Simulated OTP is: ${generatedOTP}`); // (In real world, you'd send this via email)

  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('otp-screen').style.display = 'block';
}

function verifyOTP() {
  const otpInput = document.getElementById('otp-input').value.trim();

  if (otpInput == generatedOTP) {
    document.getElementById('otp-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('user-name').innerText = userName;
  } else {
    alert('Incorrect OTP! Try again.');
  }
}

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  score = 0;
  timeLeft = 10;
  difficulty = 1;
  generateQuestion();
  updateScore();
  startTimer();
}

function generateQuestion() {
  let num1 = Math.floor(Math.random() * (difficulty * 10)) + 1;
  let num2 = Math.floor(Math.random() * (difficulty * 10)) + 1;
  const operations = ['+', '-', '*', '/'];
  let operation = operations[Math.floor(Math.random() * operations.length)];

  if (operation === '/') {
    num1 = num1 * num2;
  }

  let correctAnswer;
  switch (operation) {
    case '+': correctAnswer = num1 + num2; break;
    case '-': correctAnswer = num1 - num2; break;
    case '*': correctAnswer = num1 * num2; break;
    case '/': correctAnswer = num1 / num2; break;
  }

  document.getElementById('question').innerText = `What is ${num1} ${operation} ${num2}?`;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  let correctPos = Math.floor(Math.random() * 4);
  for (let i = 0; i < 4; i++) {
    let optionButton = document.createElement('button');
    if (i === correctPos) {
      optionButton.innerText = correctAnswer;
      optionButton.onclick = () => selectAnswer(true);
    } else {
      let wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
      if (wrongAnswer === correctAnswer) wrongAnswer += 3;
      optionButton.innerText = wrongAnswer;
      optionButton.onclick = () => selectAnswer(false);
    }
    optionsDiv.appendChild(optionButton);
  }
}

function selectAnswer(isCorrect) {
  if (isCorrect) {
    score += 10;
    difficulty += 0.2;
    timeLeft += 2;
  } else {
    score -= 5;
    difficulty = Math.max(1, difficulty - 0.2);
  }
  updateScore();
  generateQuestion();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('time').innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function updateScore() {
  document.getElementById('score').innerText = `Score: ${score}`;
}

function endGame() {
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('end-screen').style.display = 'block';
  document.getElementById('final-score').innerText = score;
  updateLeaderboard();
}

function updateLeaderboard() {
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

  const leaderboardList = document.getElementById('leaderboard');
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerText = `#${index + 1}: ${entry} pts`;
    leaderboardList.appendChild(li);
  });
}

function restartGame() {
  document.getElementById('end-screen').style.display = 'none';
  document.getElementById('start-screen').style.display = 'block';
}
