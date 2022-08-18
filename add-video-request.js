
addEventListener('DOMContentLoaded', (event) => {

	document.getElementById("add-video-request-btn").onclick = addVideoRequest;

	let httpRequest;
	let addVideoRequestForm = document.getElementById("video-request-form");

	function addVideoRequest(e) {
		e.preventDefault();
		if (formValidation() == false) { return false; }

		let formData = new FormData(addVideoRequestForm);
		var action = `${window.baseUrl}video-request`;
		fetch(action, {
			method: 'post',
			body: formData,
		})
			.then((bold) => bold.json())
			.then((data) => {
				document.getElementById("results").innerHTML = JSON.stringify(data);
			});
	}

	function formValidation() {

		if (addVideoRequestForm.author_name.value == "") {
			alert("Please provide your author_name!");
			addVideoRequestForm.author_name.focus();
			return false;
		}
		if (addVideoRequestForm.author_email.value == "") {
			alert("Please provide your author_email!");
			addVideoRequestForm.author_email.focus();
			return false;
		}
	}
});
