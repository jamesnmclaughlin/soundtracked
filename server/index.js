const functions = require('./function.js');

const express = require("express");
const exp = require('constants');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json())

app.post("/get-client", (req, res) => {
    const { service_name } = req.body;

    if ( service_name === null ) {
        res.status(400).end(JSON.stringify({err_code: 400, err_reason: "Missing Name Of Service."}));
    }

    const { 
        REACT_APP_STRAVA_CLIENT_ID,
        REACT_APP_FITBIT_CLIENT_ID,
        REACT_APP_LASTFM_API_KEY,
        REACT_APP_DEEZER_CLIENT_ID
    } = process.env;
    let response = null;

    switch(service_name) {
        case "strava":
            response = REACT_APP_STRAVA_CLIENT_ID;
            break;
        case "fitbit":
            response = REACT_APP_FITBIT_CLIENT_ID;
            break;
        case "lastfm":
            response = REACT_APP_LASTFM_API_KEY;
            break;
        case "deezer":
            response = REACT_APP_DEEZER_CLIENT_ID;
            break;
    }
    res.status(200).json({key: response});
});

app.post("/get-session", (req, res) => {
    const { service_name, auth_code, code_verify } = req.body;

    if (auth_code === null) {
        return(res.status(422).end(JSON.stringify({err_code: 422, err_reason: "Missing Parameters"})));
    }

    switch(service_name) {
        case "strava":
            functions.getStravaSession(auth_code, function(access_token, expiry_date, refresh_token) {
                res.status(200).end(JSON.stringify({
                    token: access_token, 
                    exp_date: expiry_date, 
                    refresh_token: refresh_token
                }));
            });
            break;
        case "fitbit":
            if (code_verify === null) {
                return(res.status(422).end(JSON.stringify({err_code: 422, err_reason: "Missing Parameters"})));
            } else {
                functions.getFitbitSession(auth_code, code_verify, function(access_token, expiry_date, refresh_token) {
                    res.status(200).end(JSON.stringify({
                        token: access_token, 
                        exp_date: expiry_date, 
                        refresh_token: refresh_token
                    }));
                });
            }

            break;
        case "lastfm":
            functions.getLastfmSession(auth_code, function(access_token, name) {
                res.status(200).end(JSON.stringify({
                    token: access_token,
                    name: name
                }));
            });
            break;
        case "deezer":
            functions.getDeezerSession(auth_code, function(access_token, expiry_date) {
                res.status(200).end(JSON.stringify({
                    token: access_token, 
                    exp_date: expiry_date
                }));
            });
            break;
        default:
            res.status(400).end(JSON.stringify({err_code: 400, err_reason: "Invalid Service."}));
            break;
    
    }
});

app.post("/refresh-session", (req, res) => {
    const { service_name, refresh_token } = req.body;

    if (refresh_token === null) {
        return(res.status(422).end(JSON.stringify({err_code: 422, err_reason: "Missing Parameters"})));
    }

    switch(service_name) {
        case "strava":
            functions.refreshStravaSession(refresh_token, function(access_token, expiry_date, refresh_token) {
                res.status(200).end(JSON.stringify({
                    token: access_token, 
                    exp_date: expiry_date, 
                    refresh_token: refresh_token
                }));
            });
            break;
        case "fitbit":
            functions.refreshFitbitSession(refresh_token, function(access_token, expiry_date, refresh_token) {
                res.status(200).end(JSON.stringify({
                    token: access_token, 
                    exp_date: expiry_date, 
                    refresh_token: refresh_token
                }));
            });
            break;
        default:
            res.status(400).end(JSON.stringify({err_code: 400, err_reason: "Service cannot be refreshed."}));
            break;
    }
});

app.get("/get-spotify-session", (req, res) => {
    functions.getSpotifySession(function(access_token, expiry_date) {
        res.status(200).end(JSON.stringify({
            token: access_token,
            exp_date: expiry_date
        }));
    });
});

app.get("/get-lastfm-songs", (req, res) => {

    const { start_date, end_date, user } = req.query;

    if (start_date === null || end_date === null || user === null) {
        return(res.status(422).end(JSON.stringify({err_code: 422, err_reason: "Missing Parameters"})));
    }

    functions.getLastFmSongs(start_date, end_date, user, function(response) {
        res.status(200).end(JSON.stringify({
            response: response
        }));
    });
});

app.listen(PORT, () => {
    console.log('Listening on '+ PORT);
})