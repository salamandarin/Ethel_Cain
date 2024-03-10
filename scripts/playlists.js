// Samuel Sutton

export function getPlaylist(token, id, divID) {
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


export function displayPlaylistTrack(track, divID) {
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

    // -------------------- Middle (Album Title) --------------------
    let albumTitle = document.createElement("p");
    albumTitle.className = "playlist-track-album desktop-only";
    albumTitle.innerText = track.album.name;
    div.appendChild(albumTitle);

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
