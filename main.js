// Put DOM elements into variables
const titleForm = document.querySelector('#titleForm');
const titleInput = document.querySelector("#movieTitle");
const msg = document.querySelector(".msg");
const resultsDiv = document.querySelector(".results");
const buttonsDiv = document.querySelector(".buttons");
// Variables for movie cards
var containerL; var containerR; var containerC;
// Declare global variable for current page displaying
var pageNum = 0; var currMovieCard = 0;
// Add Buttons
addButtons();
updateButtons();
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

// Listener for form submit
titleForm.addEventListener('submit', onSubmit);
// Listener for prev/next submit
prevBtn.addEventListener('click', onPrevClick);
nextBtn.addEventListener('click', onNextClick);



function onSubmit(e) {
	e.preventDefault();
	resultsDiv.innerHTML = '';

	if(titleInput.value == '') { // Display error message
		msg.classList.add('error');
		msg.innerHTML = 'Please enter movie title';
		pageNum = 0;
		updateButtons();

		// Remove error after 3 seconds
		setTimeout(() => msg.remove(), 3000)
	} else {
		currMovieCard = 0;
		document.getElementById("prev").style.visibility = 'hidden';
		document.getElementById("next").style.visibility = 'hidden';
		// Fetch movies from api
		fetchMovies(titleInput.value, 1);
		titleInputSAVED = titleInput.value; // Save search entry 
		document.getElementById('movieTitle').value='';
	}
}

function onPrevClick(e) {
	e.preventDefault();
	window.currMovieCard = window.currMovieCard - 10;
	if(pageNum == Math.ceil(totalResults/10)) window.currMovieCard = window.currMovieCard - (totalResults%10);
	resultsDiv.innerHTML = '';
	document.getElementById("prev").style.visibility = 'hidden';
	document.getElementById("next").style.visibility = 'hidden';
	fetchMovies(titleInputSAVED, pageNum-1);
}

function onNextClick(e) {
	e.preventDefault();
	resultsDiv.innerHTML = '';
	document.getElementById("prev").style.visibility = 'hidden';
	document.getElementById("next").style.visibility = 'hidden';
	fetchMovies(titleInputSAVED, pageNum+1);
}

async function fetchMovies(titleInputSAVED, page) {
	window.pageNum = page;

	document.getElementById("prev").style.visibility = 'hidden';
	document.getElementById("next").style.visibility = 'hidden';

	// Need to handle spaces
	movieTitle = titleInputSAVED.replace(/ /g, '%20');
	const url = `https://www.omdbapi.com/?s=${movieTitle}&page=${page}&apikey=3d206f64`;
	let response = await fetch(url);
	let movies = await response.json();
	outputData(movies);

}

async function outputData(data) {
	// Check if there are no responses found
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
		var loadingMsg = document.createElement("P");
		loadingMsg.innerText = "\n\nLoading results...";
		loadingMsg.id = "loadingMsg";
		resultsDiv.appendChild(loadingMsg);
		// Create containers for movie cards
		containerL = document.createElement("DIV"); containerL.className = "containerL";
		resultsDiv.appendChild(containerL);
		containerR = document.createElement("DIV"); containerR.className = "containerR";
		resultsDiv.appendChild(containerR);
		containerC = document.createElement("DIV"); containerC.className = "containerC";
		resultsDiv.appendChild(containerC);
		//Display movies
		displayMovies(data.Search);
		
	    
	}
		
}


async function displayMovies(data) {
	results = []
	for(i = 0; i < data.length; i++) {
		let response = await fetch(`https://www.omdbapi.com/?i=${data[i].imdbID}&type=movie&apikey=3d206f64`);
		let movieDetails = await response.json();
		results.push(movieDetails)
	}

	// Clear "Loading Results..." message
	var loadingMsg = document.getElementById("loadingMsg");
    loadingMsg.parentNode.removeChild(loadingMsg);


	for (const result of results) {
		outputMovieDetails(result);
	}

	updateButtons();

}

function outputMovieDetails(data) {
	// Incremement movie card counter
	currMovieCard++;

	if (currMovieCard%2 == 1 && currMovieCard == (totalResults)) // Add to center container
		container = document.querySelector(".containerC");
	else if (currMovieCard%2 == 1) // Odd so add to left side container
		container = document.querySelector(".containerL");
	else // Even so add to right side container
		container = document.querySelector(".containerR");

	// Extract necessary data and handle missing data
	var poster = data.Poster; if (poster == "N/A" || poster == "undefined") poster = "https://www.joblo.com/assets/images/joblo/database-specific-img-225x333.jpg";
	var title = data.Title; if (title == "N/A" || title == "undefined") title = "---";
	var release = data.Released; if (release == "N/A" || release == "undefined") release = "---";
	var runtime = data.Runtime; if (runtime == "N/A" || runtime == "undefined") runtime = "---";
	var genre = data.Genre; if (genre == "N/A" || genre == "undefined") genre = "---";
	var director = data.Director; if (director == "N/A" || director == "undefined") director = "---";

	// Create container div to house all movie contents
	var maincardcontainer = document.createElement("DIV");
	maincardcontainer.className = "maincardcontainer";
	container.appendChild(maincardcontainer);
	
	// Create div to house movie card
	var card = document.createElement("DIV");
	card.className  = "card";
	maincardcontainer.appendChild(card);
	// Create necessary elements for title, image, & details
	var titleElement = document.createElement("P");
	titleElement.innerText = `${title}\n`;
	titleElement.id = "title";
	card.appendChild(titleElement);
	var img = document.createElement("img");
	img.src = poster;
	card.appendChild(img);
	var info = document.createElement("P");
	info.innerText = `• Released: ${release}\n• Runtime: ${runtime}\n• Genre: ${genre}\n• Director: ${director}`;
	info.id = "info";
	card.appendChild(info);

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

async function updateButtons() {
	if (window.pageNum == 0 || totalResults < 10) { // No buttons becuase all results can fit on one page
		document.getElementById("prev").style.visibility = 'hidden';
		document.getElementById("next").style.visibility = 'hidden';
	} else if (window.pageNum == 1) { // Only display next
		document.getElementById("prev").style.visibility = 'hidden';
		document.getElementById("next").style.visibility = 'visible';
	} else if (window.pageNum == Math.ceil(totalResults/10)) { // Only display prev
		document.getElementById("prev").style.visibility = 'visible';
		document.getElementById("next").style.visibility = 'hidden';
	} else { // Display both next and prev
		document.getElementById("prev").style.visibility = 'visible';
		document.getElementById("next").style.visibility = 'visible';
	}
}