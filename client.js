addEventListener('DOMContentLoaded', (event) => {

    let addVideoRequestBtnElm = document.getElementById("add-video-request-btn");
    let addVideoRequestFormElm = document.getElementById("video-request-form");
    let videosList = document.querySelector('#videosList');
    // let voteDownBtnElm = document.querySelector('.vote-down-btn');

    addVideoRequestBtnElm.onclick = addVideoRequest;
    // voteUpBtnElm.addEventListener("click", function(){ alert("Hello World!"); });


    function renderSingleVideoRequest(videoRequest) {

        var videoItem = document.createElement('div'); // is a node
        videoItem.classList.add('card');
        videoItem.classList.add('mb-3');
        videoItem.innerHTML = `
                <div class="card-body d-flex justify-content-between flex-row">
                    <div class="d-flex flex-column">
                        <h3>${videoRequest.topic_title}</h3>
                        <p class="text-muted mb-2">${videoRequest.topic_details}</p>
                        <p class="mb-0 text-muted">
                        ${videoRequest.expected_result ? `<strong>Expected results:</strong> ${videoRequest.expected_result}` : ''}
                        </p>
                    </div>
                    <div class="d-flex flex-column text-center">
                        <a class="btn btn-link vote-up-btn" data-id="${videoRequest.id}">🔺</a>
                        <h3>0</h3>
                        <a class="btn btn-link vote-down-btn">🔻</a>
                    </div>
                </div>
                <div class="card-footer d-flex flex-row justify-content-between">
                    <div>
                        <span class="text-info">${videoRequest.status.toUpperCase()}</span>
                        &bullet; added by <strong>${videoRequest.author_name}</strong> on
                        <strong>${new Date(videoRequest.submit_date).toLocaleDateString()}</strong>
                    </div>
                    <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
                        <div class="badge badge-success">
                        ${videoRequest.target_level}
                        </div>
                    </div>
                </div>`;

        return videoItem;
    }

    function renderVideoRequests(videoRequests) {
        videoRequests.forEach(video => {
            videosList.appendChild(renderSingleVideoRequest(video));
        });
    }

    function loadVideoRequest() {
        fetch(`${window.baseUrl}video-request`)
            .then((blob) => blob.json())
            .then((data) => {
                renderVideoRequests(data);
            });
    }

    function formValidation() {

        if (addVideoRequestFormElm.author_name.value == "") {
            alert("Please provide your author_name!");
            addVideoRequestFormElm.author_name.focus();
            return false;
        }
        if (addVideoRequestFormElm.author_email.value == "") {
            alert("Please provide your author_email!");
            addVideoRequestFormElm.author_email.focus();
            return false;
        }
    }

    function addVideoRequest(e) {
        e.preventDefault();
        if (formValidation() == false) { return false; }

        let formData = new FormData(addVideoRequestFormElm);
        fetch(`${window.baseUrl}video-request`, {
            method: 'post',
            body: formData,
        })
            .then((blob) => blob.json())
            .then((data) => {
                document.getElementById("results").innerHTML = JSON.stringify(data);
                fetch(`${window.baseUrl}video-request`)
                    .then((blob) => blob.json())
                    .then((data) => {
                        videosList.prepend(renderSingleVideoRequest(data[0]));
                    });

            });
    }

    function voteUpVideoRequest() {
        console.log(this.dataset.id);
    }

    loadVideoRequest()
    let voteUpBtnElm = document.querySelector('.vote-up-btn');

    console.log(voteUpBtnElm);


});
