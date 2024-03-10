// Samuel Sutton
import { displayPlaylistTrack } from "./playlists.js";

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
            }
        });
    });
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Form
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getFormPlaylist(token) {
    formSetup();
    
    let playlistID = document.getElementById("playlistId").value;
    getPlaylist(token, playlistID, "form-playlist-container");

    resetForm();
}

function formSetup() {
    let errorContainer = document.getElementById("error-container");
    errorContainer.style.visibility = "hidden";

    clearPlaylist();
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
    let form = document.getElementById("playlist-form");
    form.reset();
}

function clearPlaylist() {
    let playlistContainer = document.getElementsByClassName("playlist-container");
    if (playlistContainer[0] != null) {
        playlistContainer[0].remove();
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//      Playlist
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
        // check for errors
        if (data.tracks == null) {
            showErrors("Playlist ID not found");
            return;
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