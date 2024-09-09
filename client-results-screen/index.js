const socket = io('http://localhost:5050', {
	path: '/real-time',
});

const startButton = document.getElementById('start-countdown');
const playersInfo = document.getElementById('players-info');
const winnerInfo = document.getElementById('winner-info');
playersInfo.innerHTML = 'Esperando a que el juego comience...';
startButton.addEventListener('click', () => {
	socket.emit('start-countdown');
	winnerInfo.innerHTML = '';
	playersInfo.innerHTML = 'El juego ha comenzado. Esperando a que los jugadores elijan sus opciones...';
});

socket.on('winner', (data) => {
	let player1 = data.players[0] ? data.players[0].name : '?';
	let player2 = data.players[1] ? data.players[1].name : '?';
	let choice1 = data.players[0] ? data.players[0].choice : '?';
	let choice2 = data.players[1] ? data.players[1].choice : '?';
	let winner = data.winner ? data.winner : 'Empate';
	playersInfo.innerHTML = `
	Nombre del Jugador 1: ${player1} (${choice1})<br>
	Nombre del Jugador 2: ${player2} (${choice2})<br>
	`;
	if (winner === 'Empate') {
		winnerInfo.innerHTML = `El juego ha terminado en empate`;
	} else {
		winnerInfo.innerHTML = `El ganador es: ${winner}`;
	}
});
