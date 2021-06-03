// Put DOM elements into variables
const titleForm = document.querySelector('#titleForm');
const titleInput = document.querySelector("#movieTitle");
const msg = document.querySelector(".msg");


// Listen for form submit
titleForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
	e.preventDefault();

	if(titleInput.value == '') {
		msg.classList.add('error');
		msg.innerHTML = 'Please enter movie title';

		// Remove error after 3 seconds
		setTimeout(() => msg.remove(), 3000)
	} else {
		// Display movies
		displayMovies(titleInput.value)
		// Clear fields
		titleInput.value = '';
	}
}

function displayMovies(titleInput) {
	// Need to handle spaces
	const url = `http://www.omdbapi.com/?t=${titleInput}&apikey=3d206f64`;
	fetch(url)
		.then(response => response.json())
		.then(data => console.log(data));
}
