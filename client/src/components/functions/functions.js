import React, { useEffect } from 'react';


//  -- getServiceID() --
// A function to retrieve the client ID from the backend node.js server.
//
// REQUIRES: 
//      service_name: A string parameter identifying the service e.g Strava, Fitbit... 
// 
function getServiceID(service_name) {
    const [data, setData] = React.useState(null);

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_name: service_name })
    }

    React.useEffect(() => {
        fetch("/get-client", options)
          .then((res) => res.json())
          .then((data) => setData(data.key));
      }, []);

    return data;
}

//  -- checkIfReconnectionExists() --
//
// REQUIRES: 
//      service_name: A string parameter identifying the service e.g Strava, Fitbit... 
// 
function checkIfReconnectionExists(service_name) {
    let connection = false;

    if (localStorage.getItem(service_name + '_refresh_token') !== null) {
        connection = true;
    }

    return connection;
}

//  -- checkServiceConnection() --
// A function to check the service connection of the specified service
// if the application has lost connection then result returned is false.
//
// REQUIRES: 
//      service_name: A string parameter identifying the service e.g Strava, Fitbit... 
// 
function checkServiceConnection(service_name) {

    let stillConnected = false;

    if (localStorage.getItem(service_name + '_access_token') !== null) {

        // LAST.FM does not provide an expiry date and therefore cannot expire
        // IGNORE EXPIRY DATE
        if (service_name !== "lastfm") {

            if (localStorage.getItem(service_name + '_expiry_date') !== null) {
                if (Date.parse(localStorage.getItem(service_name + '_expiry_date')) > Date.now()) {
                    stillConnected = true;
                }
            }
        }
        else {
            stillConnected = true
        }
    }

    if (!stillConnected) {
        stillConnected = reconnectService(service_name);
    }
    
    return stillConnected;
}

//  -- reconnectService() --
// A function to refresh the connection of the specified service if the 
// application has lost connection.
//
// REQUIRES: 
//      service_name: A string parameter identifying the service e.g Strava, Fitbit... 
// 
function reconnectService(service_name) {

    if (checkIfReconnectionExists(service_name)) {

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                code_verify: localStorage.getItem("fitbitCV"),
                service_name: service_name,
                refresh_token: localStorage.getItem(service_name + "_refresh_token")
            })
        }
    
        fetch("/refresh-session", options)
            .then((res) => res.json())
            .then((data) => {

                if (data.hasOwnProperty('token')) {
                    localStorage.setItem(service_name + '_access_token', data.token);
                }
                if (data.hasOwnProperty('exp_date')) {
                    localStorage.setItem(service_name + '_expiry_date', data.exp_date);
                }
                if (data.hasOwnProperty('refresh_token')) {
                    localStorage.setItem(service_name + '_refresh_token', data.refresh_token);
                }

                return true;
            });
          
    }

    return false;
}


async function checkSpotifyConnection() {

    let reconnectionRequired = true;

    if (localStorage.getItem('spotify_access_token') !== null && localStorage.getItem('spotify_expiry_date') !== null) {
        if (Date.parse(localStorage.getItem('spotify_expiry_date')) > Date.now()) {
            reconnectionRequired = false;
        }
    }

    if (reconnectionRequired) {
        await fetch("/get-spotify-session")
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty('token')) {
                    localStorage.setItem('spotify_access_token', data.token);
                }
                if (data.hasOwnProperty('exp_date')) {
                    localStorage.setItem('spotify_expiry_date', data.exp_date);
                }
            });
    }

    return (localStorage.getItem('spotify_access_token') !== null);
}


async function spotifySearch(artist, year, album, track, callback) {
    const baseURL = "https://api.spotify.com/v1/search?";
    let query = "";

    if (track != null) {

        query += "track:" + track.replace("'", "") + " ";
    }

    if (artist != null) {
        query += "artist:" + artist.replace("'", "") + " ";
    }

    if (year != null) {
        query += "year:" + year + " ";
    }

    if (album != null) {
        query += "album:" + album;
    }

    const type = 'track';
    const limit = 1;
    const offset = 0;

    let postdata = null;

    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("spotify_access_token"), 
            'Content-Type': 'application/json'
        }
    };

    if (checkSpotifyConnection()) {
        await fetch(baseURL + "q=" + (query) + "&type=" + type + "&limit=" + limit + "&offset=" + offset, options)
        .then(res => res.json())
        .then((response) => {
            postdata = response;
        });
    }

    callback(postdata);
}

async function audioFeatures(tracks, callback) {

    const baseURL = "https://api.spotify.com/v1/audio-features?";
    let postdata = null;

    const options = {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("spotify_access_token"),
            'Content-Type': 'application/json'
        }
    }

    if (checkSpotifyConnection()) {
        await fetch(baseURL + "ids=" + encodeURIComponent(tracks), options)
            .then(res => res.json())
            .then((response) => {
                postdata = response
            });
    };

    callback(postdata);
}


async function getSeeds() {

    const listOfSongs = [
        {
            artist: "Bon Iver",
            year: "2016",
            album: "22, a million",
            track: "8 Circle"
        },
        {
            artist: "Wallows",
            year: "2019",
            album: "Nothing happens",
            track: "Are you bored yet?"
        },
        {
            artist: "Adele",
            year: "2008",
            album: "19",
            track: "Chasing pavements"
        },
        {
            artist: "Sam Fender",
            year: "2021",
            album: "Seventeen going under",
            track: "Seventeen going under"
        },
        {
            artist: "Taylor Swift",
            year: "2020",
            album: "Evermore",
            track: "Champagne Problems"
        }
    ]

    let seedList = "";
    let trackID = null;

    for (let song of listOfSongs) {
        await spotifySearch(song.artist, song.year, song.album, song.track, function(response) {
            trackID = response.tracks.items[0].id;

            if (trackID !== null) {
                if (seedList !== "") {
                    seedList += ",";
                }
                seedList += trackID;
            }

        });

    }

    return seedList;
}

async function getStravaActivities(callback) {
    const baseURL = "https://www.strava.com/api/v3/athlete/activities";
    let postdata = null;

    const options = {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("strava_access_token"),
            'Content-Type': 'application/json'
        }
    }

    if (checkServiceConnection("strava")) {
        await fetch(baseURL, options)
            .then(res => res.json())
            .then((response) => {
                postdata = response;
            });
    }
    
    callback(postdata)
}

async function getStravaActivityInfo(id, callback) {
    const baseURL = "https://www.strava.com/api/v3/athlete/activities";
    let postdata = null;
    let query = "";

    query += "keys=time,distance,heartrate,altitude,moving";
    query += "&key_by_type=true"

    const options = {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("strava_access_token"),
            'Content-Type': 'application/json'
        }
    }

    if (checkServiceConnection("strava")) {
        await fetch("https://www.strava.com/api/v3/activities/" + id + "/streams?" + query, options)
        .then(res => res.json())
        .then((response) => {
            postdata = response;
        })
    }

    callback(postdata);
}

export { 
    checkServiceConnection, 
    getServiceID, 
    reconnectService, 
    checkIfReconnectionExists, 
    checkSpotifyConnection,
    getStravaActivities,
    getStravaActivityInfo,
    audioFeatures,
    spotifySearch,
    getSeeds
};