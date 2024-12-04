// // Select DOM elements
// const playerSetup = document.getElementById('player-setup');
// const categorySelection = document.getElementById('category-selection');
// const questionSection = document.getElementById('question-section');
// const resultsSection = document.getElementById('results-section');

// const startGameBtn = document.getElementById('start-game');
// const selectCategoryBtn = document.getElementById('select-category');
// const nextQuestionBtn = document.getElementById('next-question');
// const restartGameBtn = document.getElementById('restart-game');

// const categoryDropdown = document.getElementById('category-dropdown');
// const questionText = document.getElementById('question-text');
// const answersList = document.getElementById('answers');
// const winnerText = document.getElementById('winner');

// let players = [
//     { name: '', score: 0 },
//     { name: '', score: 0 }
// ];
// let currentPlayerIndex = 0;
// let questions = [];
// let currentQuestionIndex = 0;
// let usedCategories = [];

// // Fetch trivia categories
// async function fetchCategories() {
//     const response = await fetch('https://the-trivia-api.com/api/categories');
//     const data = await response.json();
//     Object.keys(data).forEach(category => {
//         const option = document.createElement('option');
//         option.value = category;
//         option.textContent = category;
//         categoryDropdown.appendChild(option);
//     });
// }

// // Fetch questions for the selected category
// async function fetchQuestions(category) {
//     const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&limit=6`);
//     questions = await response.json();
//     currentQuestionIndex = 0;
//     showQuestion();
// }

// // Display the current question
// function showQuestion() {
//     const question = questions[currentQuestionIndex];
//     questionText.textContent = question.question;
//     answersList.innerHTML = '';

//     // Shuffle and display answers
//     const answers = [...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5);
//     answers.forEach(answer => {
//         const li = document.createElement('li');
//         li.textContent = answer;
//         li.addEventListener('click', () => checkAnswer(answer, question.correctAnswer));
//         answersList.appendChild(li);
//     });
// }

// // Check the answer
// function checkAnswer(selectedAnswer, correctAnswer) {
//     if (selectedAnswer === correctAnswer) {
//         players[currentPlayerIndex].score += calculatePoints(currentQuestionIndex);
//     }

//     currentPlayerIndex = 1 - currentPlayerIndex; // Switch players
//     currentQuestionIndex++;

//     if (currentQuestionIndex < questions.length) {
//         showQuestion();
//     } else {
//         categorySelection.classList.remove('hidden');
//         questionSection.classList.add('hidden');
//     }
// }

// // Calculate points based on question difficulty
// function calculatePoints(index) {
//     if (index < 2) return 10; // Easy
//     if (index < 4) return 15; // Medium
//     return 20; // Hard
// }

// // Display the game results
// function showResults() {
//     resultsSection.classList.remove('hidden');
//     categorySelection.classList.add('hidden');
//     const winner =
//         players[0].score > players[1].score
//             ? players[0].name
//             : players[0].score < players[1].score
//             ? players[1].name
//             : 'It\'s a tie!';
//     winnerText.textContent = `Winner: ${winner}`;
// }

// // Event Listeners
// startGameBtn.addEventListener('click', () => {
//     players[0].name = document.getElementById('player1-name').value;
//     players[1].name = document.getElementById('player2-name').value;

//     if (!players[0].name || !players[1].name) {
//         alert('Please enter names for both players.');
//         return;
//     }

//     playerSetup.classList.add('hidden');
//     categorySelection.classList.remove('hidden');
//     fetchCategories();
// });

// selectCategoryBtn.addEventListener('click', () => {
//     const category = categoryDropdown.value;
//     if (usedCategories.includes(category)) {
//         alert('Category already used. Choose another.');
//         return;
//     }
//     usedCategories.push(category);
//     categorySelection.classList.add('hidden');
//     questionSection.classList.remove('hidden');
//     fetchQuestions(category);
// });

// restartGameBtn.addEventListener('click', () => {
//     location.reload();
// });



// DOM Elements
const playerSetup = document.getElementById('player-setup');
const categorySelection = document.getElementById('category-selection');
const questionSection = document.getElementById('question-section');
const resultsSection = document.getElementById('results-section');

const startGameBtn = document.getElementById('start-game-btn');
const selectCategoryBtn = document.getElementById('select-category-btn');
const restartGameBtn = document.getElementById('restart-game-btn');

const categoryDropdown = document.getElementById('category-dropdown');
const questionText = document.getElementById('question-text');
const answersList = document.getElementById('answers-list');
const currentPlayerDisplay = document.getElementById('current-player');
const winnerText = document.getElementById('winner-text');

// Game State Variables
let players = [
    { name: '', score: 0 },
    { name: '', score: 0 }
];
let currentPlayerIndex = 0;
let questions = [];
let currentQuestionIndex = 0;
let usedCategories = [];

// Fetch Categories from Trivia API
async function fetchCategories() {
    const response = await fetch('https://the-trivia-api.com/api/categories');
    const categories = await response.json();
    Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });
}

// Fetch Questions for the Selected Category
async function fetchQuestions(category) {
    const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&limit=6`);
    questions = await response.json();
    currentQuestionIndex = 0;
    questionSection.classList.remove('hidden');
    categorySelection.classList.add('hidden');
    showQuestion();
}

// Display the Current Question and Answers
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    answersList.innerHTML = '';
    const answers = [...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5);
    answers.forEach(answer => {
        const li = document.createElement('li');
        li.textContent = answer;
        li.addEventListener('click', () => checkAnswer(answer, question.correctAnswer));
        answersList.appendChild(li);
    });
    currentPlayerDisplay.textContent = players[currentPlayerIndex].name;
}

// Check Answer and Update Score
function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        const points = currentQuestionIndex < 2 ? 10 : currentQuestionIndex < 4 ? 15 : 20;
        players[currentPlayerIndex].score += points;
    }
    currentPlayerIndex = 1 - currentPlayerIndex;
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        finishCategory();
    }
}

// Handle Category Completion
function finishCategory() {
    questionSection.classList.add('hidden');
    categorySelection.classList.remove('hidden');
    usedCategories.push(categoryDropdown.value);
    if (usedCategories.length === Object.keys(categoryDropdown.options).length) {
        endGame();
    }
}

// End the Game and Display Results
function endGame() {
    resultsSection.classList.remove('hidden');
    categorySelection.classList.add('hidden');
    const winner =
        players[0].score > players[1].score
            ? players[0].name
            : players[1].score > players[0].score
            ? players[1].name
            : 'It\'s a tie!';
    winnerText.textContent = `Winner: ${winner}`;
}

// Restart the Game
function restartGame() {
    location.reload();
}

// Event Listeners
startGameBtn.addEventListener('click', () => {
    players[0].name = document.getElementById('player1-name').value;
    players[1].name = document.getElementById('player2-name').value;
    if (!players[0].name || !players[1].name) {
        alert('Please enter names for both players!');
        return;
    }
    playerSetup.classList.add('hidden');
    categorySelection.classList.remove('hidden');
    fetchCategories();
});

selectCategoryBtn.addEventListener('click', () => {
    const category = categoryDropdown.value;
    if (!category || usedCategories.includes(category)) {
        alert('Please select a valid category!');
        return;
    }
    fetchQuestions(category);
});

restartGameBtn.addEventListener('click', restartGame);


// Add 'Game Over' Button in HTML
const gameOverBtn = document.createElement('button');
gameOverBtn.id = 'game-over-btn';
gameOverBtn.textContent = 'End Game';
categorySelection.appendChild(gameOverBtn);

  
// Function to End Game Explicitly
function endGameExplicitly() {
    endGame(); // Reuse the endGame function to display results
}

// Modify the `finishCategory` function to detect game completion
function finishCategory() {
    questionSection.classList.add('hidden');
    categorySelection.classList.remove('hidden');
    usedCategories.push(categoryDropdown.value);

    if (usedCategories.length === categoryDropdown.options.length) {
        endGame(); // If all categories are used, end the game automatically
    }
}

// Attach Event Listener to 'Game Over' Button
gameOverBtn.addEventListener('click', endGameExplicitly);

// End the Game and Display Results
function endGame() {
    resultsSection.classList.remove('hidden');
    categorySelection.classList.add('hidden');
    questionSection.classList.add('hidden');

    const winner =
        players[0].score > players[1].score
            ? players[0].name
            : players[1].score > players[0].score
            ? players[1].name
            : 'It\'s a tie!';

    winnerText.textContent = `Game Over! Winner: ${winner}`;
}

// Restart the Game
function restartGame() {
    location.reload(); // Refresh the page to restart
}

// Attach Restart Button Event Listener
restartGameBtn.addEventListener('click', restartGame);

// Event Listener for the Start Game Button
startGameBtn.addEventListener('click', () => {
    players[0].name = document.getElementById('player1-name').value;
    players[1].name = document.getElementById('player2-name').value;

    if (!players[0].name || !players[1].name) {
        alert('Please enter names for both players!');
        return;
    }

    playerSetup.classList.add('hidden');
    categorySelection.classList.remove('hidden');
    fetchCategories();
});

// Select Category Event Listener
selectCategoryBtn.addEventListener('click', () => {
    const category = categoryDropdown.value;
    if (!category || usedCategories.includes(category)) {
        alert('Please select a valid category!');
        return;
    }

    fetchQuestions(category);
});






// // Get the switch input and status text elements
// const toggleSwitch = document.getElementById('toggle-switch');
// const switchStatus = document.getElementById('switch-status');

// // Function to update the status text based on switch state
// function updateSwitchStatus() {
//     if (toggleSwitch.checked) {
//         switchStatus.textContent = 'Switch is ON';
//         // You can trigger additional functionality when the switch is ON
//         console.log("The switch is ON");
//     } else {
//         switchStatus.textContent = 'Switch is OFF';
//         // You can trigger additional functionality when the switch is OFF
//         console.log("The switch is OFF");
//     }
// }

// // Event listener to handle changes in the switch state
// toggleSwitch.addEventListener('change', updateSwitchStatus);

// // Initialize the status when the page loads
// updateSwitchStatus();
