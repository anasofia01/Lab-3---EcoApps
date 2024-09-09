const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

const db = {
	players: [],
};

const httpServer = createServer(app);

httpServer.listen(5050, () => {
	console.log(`Server is running on http://localhost:${5050}`);
});

const io = new Server(httpServer, {
	path: '/real-time',
	cors: {
		origin: '*',
	},
});

let gameStarted = false;

io.on('connection', (socket) => {
	console.log('User connected');

	socket.on('join-game', (player) => {
		if (!gameStarted) {
			socket.emit('waiting-to-start', 'Esperando a iniciar el juego...');
		} else if (db.players.length < 2) {
			db.players.push({ ...player, id: socket.id });
			socket.emit('waiting', 'Esperando a otro jugador...');

			if (db.players.length === 2) {
				io.emit('start-game', 'Game starting now!');
			}
		} else {
			socket.emit('full', 'Game is already in progress. Please wait.');
		}
	});

	socket.on('start-countdown', () => {
		if (!gameStarted) {
			gameStarted = true;
			io.emit('game-started', 'El juego ha comenzado! Puedes unirte ahora.');
		}
	});

	socket.on('play', (data) => {
		const playerIndex = db.players.findIndex((p) => p.id === socket.id);
		if (playerIndex !== -1) {
			db.players[playerIndex].choice = data.choice;
		}

		if (db.players.length === 2 && db.players[0].choice && db.players[1].choice) {
			const result = determineWinner(db.players[0], db.players[1]);
			io.emit('winner', {
				winner: result.winner ? result.winner.name : 'Empate',
				players: db.players,
			});
			resetGame();
		}
	});

	socket.on('disconnect', () => {
		db.players = db.players.filter((player) => player.id !== socket.id);
		if (db.players.length < 2) {
			io.emit('reset', 'Un jugador se ha desconectado. Reiniciando el juego.');
			resetGame();
		}
	});
});

function resetGame() {
	db.players = [];
	gameStarted = false;
	io.emit('reset', 'El juego ha sido reiniciado. Puedes jugar de nuevo.');
}

function determineWinner(player1, player2) {
	const moves = {
		rock: { beats: 'scissors' },
		paper: { beats: 'rock' },
		scissors: { beats: 'paper' },
	};

	if (player1.choice === player2.choice) {
		return { result: 'Draw', winner: null };
	} else if (moves[player1.choice].beats === player2.choice) {
		return { result: `${player1.name} wins`, winner: player1 };
	} else {
		return { result: `${player2.name} wins`, winner: player2 };
	}
}
