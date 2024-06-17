import { questions } from './questions.js';

let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let skips = 2;
let timer;
let timeLeft = 60;
let prayerNumbers = [0, 1, 2, 3];
let prayerUsed = false;

function startGame() {
    document.getElementById('welcome-card').classList.add('hidden');
    document.getElementById('game-card').classList.remove('hidden');
    shuffle(questions); // Embaralha a ordem das perguntas
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = 0;
    }
    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.question;
    question.options.forEach((option, index) => {
        const button = document.getElementById('option' + index);
        button.innerText = option;
        button.style.opacity = 1;
        button.style.backgroundColor = '#007bff';
    });
    resetTimer();
}

function answerQuestion(selectedOption) {
    clearInterval(timer);
    const question = questions[currentQuestionIndex];
    const messageElement = document.getElementById('message');
    if (selectedOption === question.answer) {
        score += 10;
        messageElement.innerText = "Parabéns, você acertou! 😊";
        messageElement.style.color = "green";
    } else {
        score -= 8;
        lives--;
        messageElement.innerText = "Você errou! 😢";
        messageElement.style.color = "red";
    }
    messageElement.classList.remove('hidden');
    updateStatus();
    setTimeout(() => {
        messageElement.classList.add('hidden');
        if (lives > 0) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            endGame();
        }
    }, 2000);
}

function skipQuestion() {
    if (skips > 0) {
        skips--;
        currentQuestionIndex++;
        loadQuestion();
        updateStatus();
    } else {
        const messageElement = document.getElementById('message');
        messageElement.innerText = "Você não tem mais pulos!";
        messageElement.style.color = "orange";
        messageElement.classList.remove('hidden');
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 2000);
    }
}

function updateStatus() {
    document.getElementById('score').innerText = score;
    document.getElementById('lives').innerText = lives;
    document.getElementById('skips').innerText = skips;
}

function resetGame() {
    score = 0;
    lives = 3;
    skips = 2;
    currentQuestionIndex = 0;
    prayerUsed = false;
    document.getElementById('pray-button').disabled = false;
    document.getElementById('welcome-card').classList.remove('hidden');
    document.getElementById('game-card').classList.add('hidden');
    updateStatus();
}

function startTimer() {
    timeLeft = 60;
    document.getElementById('time').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            const messageElement = document.getElementById('message');
            messageElement.innerText = "Qual é a sua resposta?";
            messageElement.style.color = "orange";
            messageElement.classList.remove('hidden');
            setTimeout(() => {
                answerQuestion(-1);
            }, 3000);
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

function endGame() {
    const messageElement = document.getElementById('message');
    messageElement.innerText = "Fim de jogo! Sua pontuação final é: " + score;
    messageElement.style.color = "blue";
    messageElement.classList.remove('hidden');
    setTimeout(() => {
        resetGame();
    }, 3000);
}

function showPrayerCard() {
    if (!prayerUsed) {
        document.getElementById('game-card').classList.add('hidden');
        document.getElementById('prayer-card').classList.remove('hidden');
        shuffle(prayerNumbers);
        const prayerCards = document.querySelectorAll('.prayer-card');
        prayerCards.forEach((card, index) => {
            card.innerText = '?';
            card.dataset.number = prayerNumbers[index];
        });
    } else {
        const messageElement = document.getElementById('message');
        messageElement.innerText = "Você já orou nessa partida, agora só um milagre, vai na fé...";
        messageElement.style.color = "orange";
        messageElement.classList.remove('hidden');
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 2000);
    }
}

function revealNumber(index) {
    const card = document.querySelectorAll('.prayer-card')[index];
    const number = parseInt(card.dataset.number);
    card.innerText = number;
    const messageElement = document.getElementById('prayer-message');
    switch (number) {
        case 3:
            messageElement.innerText = "Sua oração foi forte, você eliminou 3 respostas incorretas!";
            break;
        case 2:
            messageElement.innerText = "Sua oração foi atendida, você eliminou 2 respostas incorretas!";
            break;
        case 1:
            messageElement.innerText = "Sua oração quase não passou do teto, mas você conseguiu eliminar 1 resposta incorreta!";
            break;
        case 0:
            messageElement.innerText = "Sua oração tá fraca, você não eliminou nenhuma resposta incorreta!";
            break;
    }
    messageElement.style.color = "purple";
    messageElement.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('prayer-card').classList.add('hidden');
        document.getElementById('game-card').classList.remove('hidden');
        eliminateWrongAnswers(number);
        messageElement.classList.add('hidden');
    }, 3000);
    prayerUsed = true;
    document.getElementById('pray-button').disabled = true;
}

function eliminateWrongAnswers(number) {
    const question = questions[currentQuestionIndex];
    let eliminated = 0;
    question.options.forEach((option, index) => {
        if (index !== question.answer && eliminated < number) {
            const button = document.getElementById('option' + index);
            button.style.opacity = 0.3;
            button.style.backgroundColor = '#ccc';
            eliminated++;
        }
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Exponha as funções globais para que possam ser chamadas a partir do HTML
window.startGame = startGame;
window.answerQuestion = answerQuestion;
window.skipQuestion = skipQuestion;
window.showPrayerCard = showPrayerCard;
window.revealNumber = revealNumber;