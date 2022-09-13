addEventListener('DOMContentLoaded', (event) => {

    let addVideoRequestBtnElm = document.getElementById("add-video-request-btn");
    let addVideoRequestFormElm = document.getElementById("video-request-form");
    let videosList = document.querySelector('#videosList');
    let sortingType = document.querySelectorAll('.sorting_type');

    sortingType.forEach((elm) => {
        elm.addEventListener('click', () => {
            loadVideoRequest(elm.value);
        });
    });

    addVideoRequestBtnElm.onclick = addVideoRequest;

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
                        <a class="btn btn-link vote-up-btn" id="votes_ups_${videoRequest._id}" >🔺</a>
                        <h3 id="score_vote_${videoRequest._id}">${videoRequest.votes.ups - videoRequest.votes.downs}</h3>
                        <a class="btn btn-link vote-down-btn" id="votes_downs_${videoRequest._id}">🔻</a>
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
            voteElementAddClickEvent(video._id);
        });
    }

    function voteElementAddClickEvent(id) {
        const voteUpsElm = document.getElementById(`votes_ups_${id}`);
        const voteDownsElm = document.getElementById(`votes_downs_${id}`);
        const scoreVoteElm = document.getElementById(`score_vote_${id}`);

        voteUpsElm.addEventListener('click', (e) => {
            fetch(`${window.baseUrl}video-request/vote`, {
                method: 'PUT',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ id: id, vote_type: 'ups' })
            })
                .then((blob) => blob.json())
                .then((video) => {
                    scoreVoteElm.innerText = video.votes.ups - video.votes.downs;
                });
        });

        voteDownsElm.addEventListener('click', (e) => {
            fetch(`${window.baseUrl}video-request/vote`, {
                method: 'PUT',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ id: id, vote_type: 'downs' })
            })
                .then((blob) => blob.json())
                .then((video) => {
                    scoreVoteElm.innerText = video.votes.ups - video.votes.downs;
                });
        });
    }

    function loadVideoRequest(sorting = 'new_first') {
        fetch(`${window.baseUrl}video-request?sorting=${sorting}`)
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
                        voteElementAddClickEvent(data[0]._id);

                    });

            });
    }

    function voteUpVideoRequest() {
        console.log(this.dataset.id);
    }

    loadVideoRequest()

});
