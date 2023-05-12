import React from 'react';

const crypto = require('crypto');
const hex2dec = require('hex2dec');
const base64url = require('base64url');

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
        console.log("reconnect")
        await fetch("/get-spotify-session")
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty('token')) {
                    localStorage.setItem('spotify_access_token', data.token);
                }
                if (data.hasOwnProperty('exp_date')) {
                    localStorage.setItem('spotify_expiry_date', data.exp_date);
                }

                return (localStorage.getItem('spotify_access_token') !== null);
            });
    } else {
        return true;
    }
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
                callback(postdata);
            });
    };

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

        if (checkSpotifyConnection()) {
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

    }

    return seedList;
}

async function getStravaActivities() {

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

    return postdata
}

async function getStravaActivityInfo(id) {
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

    return(postdata);
}

async function searchFunction(pace, tracks) {
    let seedList = "";
    let trackID = null;
    let trackList = [];
    let seedTrackInfo = []

    // Convert value to understandable pace
    let pace_text = new Date(parseInt(pace * 1000) * 1000).toISOString().slice(14, 19)

    for (let song of tracks) {
        let now_playing = false;

        // song.name = track
        // song.artist.name = artist
        // song.album.#text = album
        if (song.hasOwnProperty('@attr')) {
            if (song["@attr"].hasOwnProperty('nowplaying')) {
                now_playing = song["@attr"].nowplaying;
            }
        }

        if (!now_playing) {

            if (checkSpotifyConnection()) {
                await spotifySearch(song.artist['#text'], null, null, song.name, function(response) {
                    if (response.tracks.items.length > 0) {
                        trackID = response.tracks.items[0].id;
                        let item = response.tracks.items[0]
                        seedTrackInfo.push({
                            album: item.album,
                            artists: item.artists,
                            name: item.name,
                            popularity: item.popularity
                        });

                    } else {
                        trackID = null;
                    }

                    if (trackID !== null) {
                        if (seedList !== "") {
                            seedList += ",";
                        }
                        seedList += trackID;
                    }
                });
            }
        }
    }

    await audioFeatures(seedList, function(trackInfo) {
        if (trackInfo.audio_features.length > 0) {
            let counter = 0;

            for (let feature of trackInfo.audio_features) {
                trackList.push({
                    pace: pace,
                    pace_text: pace_text,
                    id: feature.id,
                    bpm: Math.round(feature.tempo),
                    loudness: feature.loudness,
                    energy: feature.energy,
                    key: feature.key,
                    speechiness: feature.speechiness,
                    acousticness: feature.acousticness,
                    danceability: feature.danceability,
                    track_information: seedTrackInfo[counter]
                })

                counter += 1;
            }
        }
    })

    return trackList;
}

function connectURL(apiService) {

    let url = null;
    let response_type = "code";
    let scope = null;
    let approval_prompt = "force";
    let redirectURL = "http://localhost:3000/" + apiService;
    let code_challenge = null;
    let apiIdentifier = getServiceID(apiService);

    switch(apiService) {
        case "strava":
            scope = "read,activity:read_all";
            url = "https://www.strava.com/oauth/authorize?";
            url = url + "client_id=" + apiIdentifier + "&response_type=" + response_type + "&redirect_uri=" + redirectURL + "&approval_prompt=" + approval_prompt + "&scope=" + scope;
            break;
        case "fitbit": 
            code_challenge = base64url.fromBase64(crypto.createHash('sha256').update(generateCodeVerifier()).digest('base64'));

            scope = "activity,heartrate";
            url = "https://www.fitbit.com/oauth2/authorize?";
            url = url + "client_id=" + apiIdentifier + "&code_challenge=" + code_challenge + "&code_challenge_method=S256&response_type=" + response_type + "&scope=activity+heartrate" ;
            break;
        case "lastfm":
            url = "http://www.last.fm/api/auth?";
            url = url + "api_key=" + apiIdentifier + "&cb=" + redirectURL;
            break;
        case "deezer": 
            url = "https://connect.deezer.com/oauth/auth.php?";
            url = url + "app_id=" + apiIdentifier + "&redirect_uri=" + redirectURL + "&perms=basic_access,listening_history"
            break;
        default: 
            break;
    }

    return url;
}

function generateCodeVerifier() {
    // Clearing previous code verifier
    localStorage.removeItem('fitbitCV');
    let code = "";
    
    while (code.length < 43 || code.length > 128) {
        code = hex2dec.hexToDec((crypto.randomBytes(32)).toString('hex')).toString();
    }
    localStorage.setItem('fitbitCV', code);

    return code;
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
    searchFunction,
    getSeeds,
    connectURL
};