// Put DOM elements into variables
const titleForm = document.querySelector('#titleForm');
const titleInput = document.querySelector("#movieTitle");
const msg = document.querySelector(".msg");
const resultsDiv = document.querySelector(".results");


// Listen for form submit
titleForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
	e.preventDefault();
	resultsDiv.innerHTML = '';

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
		console.log(data);
		//Display movies
		data = data.Search;
	    for(i = 0; i < data.length; i++) {
	    	var title = data[i].Title;
	    	var release = data[i].Year; if (typeof release === "undefined") release = "———";
	    	var runtime = data[i].Runtime; if (typeof runtime === "undefined") runtime = "———";
	    	var genre = data[i].Genre; if (typeof genre === "undefined") genre = "———";
	    	var director = data[i].Director; if (typeof director === "undefined") director = "———";
	    	var poster = data[i].Poster; if (typeof poster === "N/A") poster = "https://www.joblo.com/assets/images/joblo/database-specific-img-225x333.jpg";
			var img = document.createElement("img");
			img.src = poster;
			resultsDiv.appendChild(img);
			var titleElement = document.createElement("P");
			titleElement.innerText = `${title}\n`;
			titleElement.id = "title";
			resultsDiv.appendChild(titleElement);
			var info = document.createElement("P");
			info.innerText = `• Released: ${release}\n• Runtime: ${runtime}\n• Genre: ${genre}\n• Director: ${director}`;
			info.id = "info";
			resultsDiv.appendChild(info);

	    }
	}
		
}
