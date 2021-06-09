// Put DOM elements into variables
const titleForm = document.querySelector('#titleForm');
const titleInput = document.querySelector("#movieTitle");
const msg = document.querySelector(".msg");
const resultsDiv = document.querySelector(".results");
const buttonsDiv = document.querySelector(".buttons");
// Declare global variable for current page displaying
var pageNum = 0;
// Add Buttons
addButtons();
updateButtons();
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

// Listener for form submit
titleForm.addEventListener('submit', onSubmit);
prevBtn.addEventListener('click', onPrevClick);
nextBtn.addEventListener('click', onNextClick);



function onSubmit(e) {
	e.preventDefault();
	resultsDiv.innerHTML = '';

	if(titleInput.value == '') {
		msg.classList.add('error');
		msg.innerHTML = 'Please enter movie title';
		pageNum = 0;
		updateButtons();

		// Remove error after 3 seconds
		setTimeout(() => msg.remove(), 3000)
	} else {
		// Fetch movies from api
		fetchMovies(titleInput.value, 1);
		titleInputSAVED = titleInput.value;
		document.getElementById('movieTitle').value='';
	}
}

function onPrevClick(e) {
	e.preventDefault();
	resultsDiv.innerHTML = '';
	fetchMovies(titleInputSAVED, pageNum-1);
}

function onNextClick(e) {
	e.preventDefault();
	resultsDiv.innerHTML = '';
	fetchMovies(titleInputSAVED, pageNum+1);
}

function fetchMovies(titleInputSAVED, page) {
	window.pageNum = page;
	// Need to handle spaces
	movieTitle = titleInputSAVED.replace(/ /g, '%20');
	const url = `https://www.omdbapi.com/?s=${movieTitle}&page=${page}&apikey=3d206f64`;
	fetch(url)
		.then(response => response.json())
		.then(data => outputData(data));
}

function outputData(data) {
	// Check if there were no responses found
	if(data.Response == "False"){
		resultsDiv.classList.add('error');
		resultsDiv.innerHTML = "Sorry! No results found.";
		window.pageNum = 0;
		updateButtons();
	} else {
		window.totalResults = parseInt(data.totalResults);
		// Display message
		var resultsMsg = document.createElement("P");
		if (totalResults == 1) resultsMsg.innerText = `1 result found for "${titleInputSAVED}"`; // Check for singular 'result'
		else resultsMsg.innerText = `${totalResults} results found for "${titleInputSAVED}"`; // Otherwise plural 'results'
		resultsMsg.id = "resultsMsg";
		resultsDiv.appendChild(resultsMsg);
		var pageMsg = document.createElement("P");
		pageMsg.innerText = `page ${pageNum} of ${Math.ceil(totalResults/10)}`;
		pageMsg.id = "pageMsg";
		resultsDiv.appendChild(pageMsg);
		//Display movies
		displayMovies(data.Search);
		updateButtons();
	    
	}
		
}


function displayMovies(data) {
	for(i = 0; i < data.length; i++) {
		// Get movie details from api
		fetch(`https://www.omdbapi.com/?i=${data[i].imdbID}&type=movie&apikey=3d206f64`)
			.then(response => response.json())
			.then(data => outputMovieDetails(data));
	}
}

function outputMovieDetails(data) {
	// Extract necessary data and handle missing data
	var poster = data.Poster; if (poster == "N/A" || poster == "undefined") poster = "https://www.joblo.com/assets/images/joblo/database-specific-img-225x333.jpg";
	var title = data.Title; if (title == "N/A" || title == "undefined") title = "---";
	var release = data.Released; if (release == "N/A" || release == "undefined") release = "---";
	var runtime = data.Runtime; if (runtime == "N/A" || runtime == "undefined") runtime = "---";
	var genre = data.Genre; if (genre == "N/A" || genre == "undefined") genre = "---";
	var director = data.Director; if (director == "N/A" || director == "undefined") director = "---";
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


function addButtons() {
	var prevBtn = document.createElement("BUTTON");   // Create a <button> element
	prevBtn.innerHTML = "&laquo; Previous";
	prevBtn.id = "prev";
	buttonsDiv.appendChild(prevBtn);
	var nextBtn = document.createElement("BUTTON");   // Create a <button> element
	nextBtn.innerHTML = "Next &raquo;";
	nextBtn.id = "next";
	buttonsDiv.appendChild(nextBtn);
}

function updateButtons() {
	if (window.pageNum == 0 || totalResults < 10) {
		document.getElementById("prev").style.visibility = 'hidden';
		document.getElementById("next").style.visibility = 'hidden';
	} else if (window.pageNum == 1) {
		document.getElementById("prev").style.visibility = 'hidden';
		document.getElementById("next").style.visibility = 'visible';

	} else if (window.pageNum == Math.ceil(totalResults/10)) {
		document.getElementById("prev").style.visibility = 'visible';
		document.getElementById("next").style.visibility = 'hidden';
	} else {
		document.getElementById("prev").style.visibility = 'visible';
		document.getElementById("next").style.visibility = 'visible';
	}
}