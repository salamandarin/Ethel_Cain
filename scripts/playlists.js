// Samuel Sutton
window.addEventListener("load", function() {
    formSetup();

    let client_id = "3aff52cc2e1c40ab9aa2fa4daac346cb";
    let client_secret = "43d7592046734b4aa5736db25dc40ed6";
    let url = "https://accounts.spotify.com/api/token";
    let token = "";
    fetch(url, {
        method: "POST",
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        },
        body : new URLSearchParams({
            "grant_type" : "client_credentials",
            "client_id" : client_id,
            "client_secret" : client_secret
        })
    })
    .then(response => response.json())
    .then(data => {
        token = data.access_token;

        // form validation
        let button = document.getElementById("submit-button");
        button.addEventListener("click", function(event) {
            event.preventDefault();
            if (validateForm()) {
                getFormPlaylist(token);
                resetForm();
            }
        });
    });
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Form
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function formSetup() {
    let errorContainer = document.getElementById("error-container");
    errorContainer.style.visibility = "hidden";
}

function validateForm() {
    removeErrors();
    let result = true;

    let playlistIDtxt = document.getElementById("playlistId");
    if (playlistIDtxt.value.length == 0) {
        showErrors("Missing playlist ID");
        result = false;
    }

    return result;
}
function showErrors(errorMessage) {
    let playlistIDtxt = document.getElementById("playlistId");
    playlistIDtxt.style.backgroundColor = "rgb(255, 100, 100)";

    let errorContainer = document.getElementById("error-container");
    errorContainer.style.visibility = "visible"

    errorContainer.innerText = `Error: ${errorMessage}`;
}
function removeErrors() {
    let playlistIDtxt = document.getElementById("playlistId");
    playlistIDtxt.style.backgroundColor = "white";

    let errorContainer = document.getElementById("error-container");
    errorContainer.style.visibility = "visible"
}

function resetForm() {
    // let form = document.getElementById("playlist-form");
    // form.reset();

    let playlistID = document.getElementById("playlistId");
    playlistID.reset();

}

function getFormPlaylist(token) {
    formSetup();
    
    let playlistID = document.getElementById("playlistId").value;
    getPlaylist(token, playlistID, "form-playlist-container");
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Playlists
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function getPlaylist(token, id, divID) {
    let url = `https://api.spotify.com/v1/playlists/${id}?market=US`;
    fetch(url, {
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token
        }
    })
    .then(response => response.json())
    .then(data => {
        // check for errors
        if (data.tracks == null) {
            showErrors("Playlist ID not found");
        }

        // playlist container
        let div = document.createElement("div");
        div.className = "playlist-container";
        div.id = id;
        document.getElementById(divID).appendChild(div);

        data.tracks.items.forEach(track => {
            // display each individual track
            displayPlaylistTrack(track, id);
        });
    });
}

function displayPlaylistTrack(track, divID) {
    track = track.track;

    // track container
    let div = document.createElement("div");
    div.className = "playlist-track";
    document.getElementById(divID).appendChild(div);


    // -------------------- Far Left Side (Image + Name & Artists --------------------
    
    // far right left container (for image + name & artists)
    let leftSideContainer = document.createElement("div");
    leftSideContainer.className = "playlist-far-left-container";
    div.appendChild(leftSideContainer);
    
    // track image
    if (!track.is_local) {
        let img = document.createElement("img");
        img.className = "playlist-track-image";
        img.src = track.album.images[0].url;
        leftSideContainer.appendChild(img);
    }
    else {
        let img = document.createElement("img");
        img.className = "playlist-track-image";
        img.src = "media/images/no_image.jpg";
        leftSideContainer.appendChild(img);
    }

    // text container
    let textContainer = document.createElement("div");
    textContainer.className = "playlist-text-container";
    leftSideContainer.appendChild(textContainer);

    // track name
    let name = document.createElement("p");
    name.className = "playlist-track-name";
    name.innerText = track.name;
    textContainer.appendChild(name);

    // artist name(s)
    let artistNames = document.createElement("p");
    artistNames.className = "playlist-track-artists";
    for (let i = 0; i < track.artists.length; ++i) {
        if (i > 0) {
            artistNames.innerText += ", ";
        }
        artistNames.innerText += track.artists[i].name;
    }
    textContainer.appendChild(artistNames);


    // -------------------- Far Right Side (Duration & Play Button) --------------------

    // far right side container (for duration + play button)
    let rightSideContainer = document.createElement("div");
    rightSideContainer.className = "playlist-far-right-container";
    div.appendChild(rightSideContainer);

    // duration
    let totalSeconds = parseInt(track.duration_ms / 1000);
    let minutes = parseInt(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    let duration = document.createElement("p");
    duration.className = "playlist-track-duration";
    duration.innerText = `${minutes}:${seconds}`;
    rightSideContainer.appendChild(duration);

    // ---------- Play/Pause Button ----------
    if (!track.is_local && track.preview_url != null) {
        // clickable wrapper for play button image
        let clickable = document.createElement("a");
        clickable.href = "#";
        clickable.className = "play-button";
        rightSideContainer.appendChild(clickable);

        // play/pause button image
        let playButton = document.createElement("img");
        playButton.className = "play-button-image";
        playButton.src = "media/images/play_button.png";
        clickable.appendChild(playButton);

        // preview audio
        let audio = new Audio(track.preview_url);
        clickable.addEventListener("click", function(event) {
            event.preventDefault();
            if (audio.paused) {
                playButton.src = "media/images/pause_button.png";
                audio.play();
            }
            else {
                playButton.src = "media/images/play_button.png";
                audio.pause();
            }
        });
    }
}
