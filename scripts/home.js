// Samuel Sutton
window.addEventListener("load", function() {
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

        // home page albums
        // ----------------------------------------
        let EthelCain = "0avMDS4HyoCEP6RqZJWpY2"; // Ethel Cain's artist id
        getArtistAlbums(token, EthelCain, "ecAlbums");

        getArtistSingles(token, EthelCain, "ecSingles");
    })
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Albums
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function getArtistAlbums(token, id, divID) {
    // url gets ONLY albums, not singles or others
    let url = `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album&market=US`;
    fetch(url, {
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token
        }
    })
    .then(response => response.json())
    .then(data => {
        data.items.forEach(album => {
            displayAlbum(album, token, divID);
        });
    });
}

function displayAlbum(album, token, divID) {
    // album container
    let div = document.createElement("div");
    div.className = "single-album";
    div.id = album.id;
    document.getElementById(divID).appendChild(div);

    // main section container
    let mainDiv = document.createElement("div");
    mainDiv.className = "single-album-main";
    mainDiv.id = `main-${album.id}`;
    div.appendChild(mainDiv);

    // clickable wrapper for image
    let clickable = document.createElement("a");
    clickable.href = "#";
    mainDiv.appendChild(clickable);
    // click function
    let visible = false;
    clickable.addEventListener("click", function(event) {
        event.preventDefault();
        visible = showAlbumDetails(album, token, visible);
    });

    // album image
    let img = document.createElement("img");
    img.className = "album-image";
    img.src = album.images[0].url;
    clickable.appendChild(img);

    // album name
    let name = document.createElement("h3");
    name.innerText = album.name;
    mainDiv.appendChild(name);
}

function showAlbumDetails(album, token, visible) {
    if (!visible) {
        // release date
        let date = document.createElement("p");
        date.className = "album-date";
        date.id = `date-${album.id}`;
        date.innerText = `Released: ${album.release_date}`;
        document.getElementById(`main-${album.id}`).appendChild(date);

        getAlbumTracks(album, token)
    }
    else {
        removeAlbumDetails(album);
    }

    visible = (!visible);
    return visible;
}

function getAlbumTracks(album, token) {
    let url = `https://api.spotify.com/v1/albums/${album.id}/tracks?market=US`;
    fetch(url, {
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token
        }
    })
    .then(response => response.json())
    .then(data => {
        // get rid of curved corners on bottom of above part
        let mainDiv = document.getElementById(`main-${album.id}`);
        mainDiv.style.borderBottomLeftRadius = 0;
        mainDiv.style.borderBottomRightRadius = 0;

        // container for tracklist
        let tracklistContainer = document.createElement("div");
        tracklistContainer.className = "album-tracklist-container";
        tracklistContainer.id = `tracks-${album.id}`;
        let radius = window.getComputedStyle(mainDiv).getPropertyValue("border-top-left-radius");
        tracklistContainer.style.borderBottomLeftRadius = radius;
        tracklistContainer.style.borderBottomRightRadius = radius;
        document.getElementById(album.id).appendChild(tracklistContainer);

        // tracklist title
        let tracklistTitle = document.createElement("h3");
        tracklistTitle.innerText = "Tracklist";
        tracklistContainer.appendChild(tracklistTitle);

        // list for tracks
        let tracklist = document.createElement("ol");
        tracklist.className = "album-tracklist";
        tracklistContainer.appendChild(tracklist);

        // display each track in tracklist
        data.items.forEach(track => {
            displayAlbumTrack(tracklist, track);
        });
    });
}

function displayAlbumTrack(tracklist, track) { // Displays ONE track
    let trackElem = document.createElement("li");
    trackElem.innerText = track.name;
    tracklist.appendChild(trackElem);
}

function removeAlbumDetails(album) {
    // remove date & tracklist
    date = document.getElementById(`date-${album.id}`);
    date.remove();
    tracks = document.getElementById(`tracks-${album.id}`);
    tracks.remove();

    // add curved corners back on bottom of above part
    let mainDiv = document.getElementById(`main-${album.id}`);
    let radius = window.getComputedStyle(mainDiv).getPropertyValue("border-top-left-radius");
    mainDiv.style.borderRadius = radius;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Singles
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getArtistSingles(token, id, divID) {
    // url gets singles & compilations
    let url = `https://api.spotify.com/v1/artists/${id}/albums?include_groups=single%2Ccompilation&market=US`;
    fetch(url, {
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token
        }
    })
    .then(response => response.json())
    .then(data => {
        data.items.forEach(album => {
            displaySingle(album, token, divID);
        });
    });
}

function displaySingle(album, token, divID) {
    // album container
    let div = document.createElement("div");
    div.className = "single-album";
    div.id = album.id;
    document.getElementById(divID).appendChild(div);

    // main section container
    let mainDiv = document.createElement("div");
    mainDiv.className = "single-album-main";
    mainDiv.id = `main-${album.id}`;
    div.appendChild(mainDiv);

    // clickable wrapper for image
    let clickable = document.createElement("a");
    clickable.href = "#";
    mainDiv.appendChild(clickable);
    // click function
    let visible = false;
    clickable.addEventListener("click", function(event) {
        event.preventDefault();
        visible = showSingleDetails(album, token, visible);
    });

    // album image
    let img = document.createElement("img");
    img.className = "album-image";
    img.src = album.images[0].url;
    clickable.appendChild(img);

    // album name
    let name = document.createElement("h3");
    name.innerText = album.name;
    mainDiv.appendChild(name);
}

function showSingleDetails(album, token, visible) {
    if (!visible) {
        // release date
        let date = document.createElement("p");
        date.className = "album-date";
        date.id = `date-${album.id}`;
        date.innerText = `Released: ${album.release_date}`;
        document.getElementById(`main-${album.id}`).appendChild(date);

        if (album.name == "Carpet Bed EP") {
            console.log(album.name);
            getAlbumTracks(album, token)
        }
    }
    else if (album.name == "Carpet Bed EP") {
        removeAlbumDetails(album);
    }
    else {
        removeSingleDetails(album);
    }

    visible = (!visible);
    return visible;
}

function removeSingleDetails(album) {
    // remove date
    date = document.getElementById(`date-${album.id}`);
    date.remove();

    // add curved corners back on bottom of above part
    let mainDiv = document.getElementById(`main-${album.id}`);
    let radius = window.getComputedStyle(mainDiv).getPropertyValue("border-top-left-radius");
    mainDiv.style.borderRadius = radius;
}