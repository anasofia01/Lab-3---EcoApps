document.getElementById('user-form').addEventListener('submit', createUser);

let timer;
let timeLeft = 10;

const countDownElement = document.createElement('p');
countDownElement.id = 'countdown-timer';

document.getElementById('data-container').appendChild(countDownElement);

function startTimer() {
	updateCountDown();
	timer = setInterval(() => {
		timeLeft--;
		updateCountDown();
		if (timeLeft <= 0) {
			clearInterval(timer);
			autoSubmitForm();
		}
	}, 1000);
}

function updateCountDown() {
	countDownElement.textContent = `Time left: ${timeLeft} seconds`;
}

function autoSubmitForm() {
	document.getElementById('user-form').submit();
}

async function createUser(event) {
	event.preventDefault();
	clearInterval(timer);
	renderLoadingState();
	const nameUser = document.getElementById('name').value;
	const choiceElement = document.querySelector('input[name="choice"]:checked');
	try {
		const player = {
			name: nameUser,
			profilePicture: 'https://avatar.iran.liara.run/public/13', // if you want to generate random images for user profile go to this link: https://avatar-placeholder.iran.liara.run/
			choice: choiceElement ? choiceElement.value : null,
		};
		const response = await fetch('http://localhost:5050/user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Specify the content type as JSON
			},
			body: JSON.stringify(player), // Convert the data to a JSON string
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		renderData(data);
		clearForm();
		setTimeout(() => {
			const container = document.getElementById('data-container');
			timeLeft = 10;
			container.innerHTML = '';
			container.appendChild(countDownElement);
			startTimer();
			console.log('si funciona');
		}, 5000);
	} catch (error) {
		renderErrorState();
	}
}

function clearForm() {
	document.getElementById('user-form').reset();
}

function renderErrorState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Failed to load data</p>';
	console.log('Failed to load data');
}

function renderLoadingState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Loading...</p>';
	console.log('Loading...');
}

function renderData(data) {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Clear previous data
	const div = document.createElement('div');
	div.className = 'item';
	div.innerHTML = 'The movement was sent';
	container.appendChild(div);
}

startTimer();
