// Put DOM elements into variables
const titleForm = document.querySelector('#titleForm');
const titleInput = document.querySelector("#movieTitle");
const msg = document.querySelector(".msg");
const resultsDiv = document.querySelector(".results");
const buttonsDiv = document.querySelector(".buttons");
// Declare global variable for current page displaying
window.pageNum = 0;
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

		// Remove error after 3 seconds
		setTimeout(() => msg.remove(), 3000)
	} else {
		// Fetch movies from api
		fetchMovies(titleInput.value, 1);
	}
}

function onPrevClick(e) {
	e.preventDefault();
	resultsDiv.innerHTML = '';
	fetchMovies(titleInput.value, pageNum-1);
}

function onNextClick(e) {
	e.preventDefault();
	resultsDiv.innerHTML = '';
	fetchMovies(titleInput.value, pageNum+1);
}

function fetchMovies(titleInput, page) {
	window.pageNum = page;
	// Need to handle spaces
	movieTitle = titleInput.replace(/ /g, '%20');
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
		//Display movies
		displayMovies(data.Search);
		updateButtons();
	    
	}
		
}


function displayMovies(data) {
	for(i = 0; i < data.length; i++) {
		var title = data[i].Title;
	    var release = data[i].Year; if (typeof release === "undefined") release = "———";
	    var runtime = data[i].Runtime; if (typeof runtime === "undefined") runtime = "———";
	    var genre = data[i].Genre; if (typeof genre === "undefined") genre = "———";
	    var director = data[i].Director; if (typeof director === "undefined") director = "———";
	    var poster = data[i].Poster; if (poster == "N/A" || typeof poster === "undefined") poster = "https://www.joblo.com/assets/images/joblo/database-specific-img-225x333.jpg";
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
	if (window.pageNum == 0) {
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