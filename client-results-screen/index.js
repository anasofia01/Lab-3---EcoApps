document.getElementById('fetch-button').addEventListener('click', fetchData);

async function fetchData() {
	renderLoadingState();
	try {
		const response = await fetch('http://localhost:5050/users');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		renderData(data);
	} catch (error) {
		console.error(error);
		renderErrorState();
	}
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

	if (data.players.length > 0) {
		container.style.display = 'block';
		data.players.forEach((item) => {
			const div = document.createElement('div');
			div.className = 'player-item';
			const img = item.position === 1 ? "<img src='resources/corona.png' class='crown' alt='corona' />" : '';
			div.innerHTML = `
				<img src="${item.profilePicture}" class="profile-pic" alt="${item.name}" />
				<div>
					<p><b>${item.name}</b> choice <b>${item.choice}</b> ${img} (position: ${item.position})</p>
				</div>
			`;
			container.appendChild(div);
			if (data.result) {
				const resultDiv = document.createElement('div');
				resultDiv.className = 'result';
				resultDiv.innerHTML = `
					<p>${data.result}</p>
				`;
				container.appendChild(resultDiv);
			}
		});
	} else {
		container.style.display = 'block';
		container.innerHTML = '<p>No data available</p>';
	}
}
