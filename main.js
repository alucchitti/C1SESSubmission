// Put DOM elements into variables
const titleForm = document.querySelector('#titleForm');
const titleInput = document.querySelector("#movieTitle");
const msg = document.querySelector(".msg");
const resultsDiv = document.querySelector(".results");


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
	titleInput = titleInput.replace(/ /g, '%20')
	const url = `http://www.omdbapi.com/?s=${titleInput}&apikey=3d206f64`;
	fetch(url)
		.then(response => response.json())
		.then(data => outputData(data));
}

function outputData(data) {
	// Check if there were no responses found
	if(data.Response == "False"){
		resultsDiv.classList.add('error');
		resultsDiv.innerHTML = "Sorry! No results found.";
	} else {
		console.log(data)
		// Remove error message if present
		resultsDiv.remove()
		//Display movies
		data = data.Search;
	    for(i = 0; i < data.length; i++) {
	    	console.log(`Title: ${data[i].Title} Release date: ${data[i].Year} Runtime: ${data[i].Runtime} Genre: ${data[i].Genre} Director: ${data[i].Director}`);
	    }
	}
		
}
