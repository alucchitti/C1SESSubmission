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

		// Clear fields
		titleInput.value = '';
	}
}
