const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json()); // utility to process JSON in requests
app.use(cors()); // utility to allow clients to make requests from other hosts or ips

const db = {
	players: [],
};

app.get('/users', (request, response) => {
	response.send(db);
	db.players = [];
});

app.post('/user', (request, response) => {
	const { body } = request;
	if (!body.choice) {
		response.status(400).send({ error: 'You must choose rock, paper or scissors' });
		return;
	}
	db.players.push(body);
	if (db.players.length === 2) {
		const result = determineWinner(db.players[0], db.players[1]);
		db.players = playersPositions(db.players, result);
		console.log(db);
		return response.status(200).send({ players: db.players });
	} else {
		response.status(201).send({ players: db.players });
	}
});

function playersPositions(players, result) {
	return players.map((player) => {
		if (result.winner && player.name === result.winner.name) {
			return { ...player, position: 1 }; //Este es el ganador
		}
		if (result.loser && player.name === result.loser.name) {
			return { ...player, position: 2 }; //Este es el perdedor
		}
		return { ...player, position: 'Draw' }; //Empate
	});
}

function determineWinner(player1, player2) {
	const moves = {
		rock: { beats: 'scissors' },
		paper: { beats: 'rock' },
		scissors: { beats: 'paper' },
	};
	if (player1.choice === player2.choice) {
		return { result: 'Draw', players: [player1, player2] };
	} else if (moves[player1.choice].beats === player2.choice) {
		return { result: `${player1.name}`, winner: player1, loser: player2 };
	} else {
		return { result: `${player2.name}`, winner: player2, loser: player1 };
	}
}

app.listen(5050, () => {
	console.log(`Server is running on http://localhost:${5050}`);
});
