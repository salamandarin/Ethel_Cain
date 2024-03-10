// Samuel Sutton
import { getPlaylist, displayPlaylistTrack } from "./playlists.js";

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

        let ecComplete = "64cm5ga4GwvGhr58g28EBu"; // discography playlist id
        getPlaylist(token, ecComplete, "discography");

        // Not for public display
        // ----------------------------------------
        // let WhiteSilas = "6mfp82sjNINulIHbKg4pMf"; // White Silas playlist id
        // getPlaylist(token, WhiteSilas, "white-silas");

        // let unreleased = "3dsAWRiXhh7jfhqBrwxKpJ"; // unreleased playlist id
        // getPlaylist(token, unreleased, "unreleased");
    });
});