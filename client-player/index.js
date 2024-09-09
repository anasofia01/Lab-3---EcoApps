const socket = io('http://localhost:5050', {
	path: '/real-time',
});

const form = document.getElementById('user-form');
const dataContainer = document.getElementById('data-container');

let playerName = '';
let playerChoice = '';

form.style.display = 'none';

dataContainer.innerHTML = 'Waiting for the game to start';
socket.on('waiting-to-start', (message) => {
	dataContainer.innerHTML = message;
});

socket.on('game-started', () => {
	form.style.display = 'block';
	dataContainer.innerHTML = 'The game has started, please enter your details';
});

form.addEventListener('submit', (event) => {
	event.preventDefault();
	playerName = document.getElementById('name').value;
	playerChoice = document.querySelector('input[name = "choice"]:checked').value;
	socket.emit('join-game', { name: playerName, choice: playerChoice });
	dataContainer.innerHTML = 'Waiting for another player';
});

socket.on('start-game', () => {
	dataContainer.innerHTML = 'The game has begun, waiting for the results';
	socket.emit('play', { name: playerName, choice: playerChoice });
});

socket.on('winner', (data) => {
	const winnerName = data.winner;
	if (winnerName === 'Empate') {
		alert('Es un empate');
	} else {
		alert(`The winner is: ${winnerName}`);
	}
	setTimeout(() => {
		dataContainer.innerHTML = 'Waiting for the game to start';
		form.style.display = 'none';
		form.reset();
		playerName = '';
		playerChoice = '';
	}, 5000);
});

socket.on('reset', (message) => {
	dataContainer.innerHTML = message;
	form.style.display = 'none';
});
