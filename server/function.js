const axios = require('axios');
const md5 = require('md5');
const { start } = require('repl');

module.exports = {

    getStravaSession: async function (authcode, callback) {
        const { REACT_APP_STRAVA_CLIENT_ID, REACT_APP_STRAVA_CLIENT_SECRET } = process.env;
    
        const baseURL = "https://www.strava.com/oauth/token";
        let postdata = null;
        let expiry_date = null;

        await axios
            .post(baseURL, {
                client_id: REACT_APP_STRAVA_CLIENT_ID,
                client_secret: REACT_APP_STRAVA_CLIENT_SECRET,
                code: authcode,
                grant_type: "authorization_code"
            })
            .then((response) => {
                postdata = response.data;
            });

        expiry_date = new Date();
        expiry_date = new Date(expiry_date.setSeconds(expiry_date.getSeconds() + parseInt(postdata.expires_in)));
            
        callback(postdata.access_token, expiry_date, postdata.refresh_token);
    },

    refreshStravaSession: async function (refresh_token, callback) {
        const { REACT_APP_STRAVA_CLIENT_ID, REACT_APP_STRAVA_CLIENT_SECRET } = process.env;
    
        const baseURL = "https://www.strava.com/oauth/token";
        let postdata = null;
        let expiry_date = null;

        await axios
            .post(baseURL, {
                client_id: REACT_APP_STRAVA_CLIENT_ID,
                client_secret: REACT_APP_STRAVA_CLIENT_SECRET,
                refresh_token: refresh_token,
                grant_type: "refresh_token"
            })
            .then((response) => {
                postdata = response.data;
            });

        expiry_date = new Date();
        expiry_date = new Date(expiry_date.setSeconds(expiry_date.getSeconds() + parseInt(postdata.expires_in)));
            
        callback(postdata.access_token, expiry_date, postdata.refresh_token);
    },


    getLastfmSession: async function (authcode, callback) {
        const {REACT_APP_LASTFM_API_KEY, REACT_APP_LASTFM_CLIENT_SECRET} = process.env;

        const baseURL = "http://ws.audioscrobbler.com/2.0";
        let postdata = null;
        let expiry_date = null;

        const apiSig = md5("api_key" + REACT_APP_LASTFM_API_KEY + "methodauth.getSessiontoken" + authcode + REACT_APP_LASTFM_CLIENT_SECRET)

        await axios
            .post(baseURL, {
                method: "auth.getSession",
                api_key: REACT_APP_LASTFM_API_KEY,
                token: authcode,
                api_sig: apiSig,
                format: "json"
            },
            {
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
                }
            })
            .then((response) => {
                postdata = response.data;
            });

            expiry_date = new Date();
            expiry_date = new Date(expiry_date.setSeconds(expiry_date.getSeconds() + parseInt(postdata.expires_in)));
    
        callback(postdata.session.key, postdata.session.name, expiry_date, postdata.refresh_token);
    },

    getDeezerSession: async function (authcode, callback) {
        const {REACT_APP_DEEZER_CLIENT_ID, REACT_APP_DEEZER_CLIENT_SECRET} = process.env;

        const baseURL = "https://connect.deezer.com/oauth/access_token.php";
        let postdata = null;
        let expiry_date = null;

        await axios
            .post(baseURL, {
                app_id: REACT_APP_DEEZER_CLIENT_ID,
                code: authcode,
                secret: REACT_APP_DEEZER_CLIENT_SECRET,
                output: "json"
            },
            {
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
                }
            })
            .then((response) => {

                postdata = response.data;

            });

        const urlParameters = new URLSearchParams(postdata);
        
        expiry_date = new Date();
        expiry_date = new Date(expiry_date.setSeconds(expiry_date.getSeconds() + parseInt(urlParameters.get("expires"))));

        callback(urlParameters.get("access_token"), expiry_date);
    },


    // ---------- FITBIT FUNCTIONS -------------

    getFitbitSession: async function (authcode, code_verifier, callback) {
        const {REACT_APP_FITBIT_CLIENT_ID, REACT_APP_FITBIT_CLIENT_SECRET} = process.env;

        const baseURL = "https://api.fitbit.com/oauth2/token";
        let postdata = null;
        let expiry_date = null;
        const authHeader = (REACT_APP_FITBIT_CLIENT_ID + ":" + REACT_APP_FITBIT_CLIENT_SECRET).toString();

        await axios
            .post(baseURL, {
                client_id: REACT_APP_FITBIT_CLIENT_ID,
                code: authcode,
                code_verifier: code_verifier,
                grant_type: "authorization_code"
            },
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(authHeader, 'utf8').toString('base64'),
                    'Content-Type': "application/x-www-form-urlencoded"
                }
            })
            .then((response) => {
                postdata = response.data;
            });

        expiry_date = new Date();
        expiry_date = new Date(expiry_date.setSeconds(expiry_date.getSeconds() + parseInt(postdata.expires_in)));
            
        callback(postdata.access_token, expiry_date, postdata.refresh_token);
    },

    refreshFitbitSession: async function (refresh_token, callback) {
        const {REACT_APP_FITBIT_CLIENT_ID, REACT_APP_FITBIT_CLIENT_SECRET} = process.env;

        const baseURL = "https://api.fitbit.com/oauth2/token";
        let postdata = null;
        let expiry_date = null;

        const authHeader = (REACT_APP_FITBIT_CLIENT_ID + ":" + REACT_APP_FITBIT_CLIENT_SECRET).toString();

        await axios 
            .post(baseURL, {
                client_id: REACT_APP_FITBIT_CLIENT_ID,
                refresh_token: refresh_token,
                grant_type: 'refresh_token'
            },
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(authHeader, 'utf8').toString('base64'),
                    'Content-Type': "application/x-www-form-urlencoded"
                }
            })
            .then((response) => {
                postdata = response.data;
            });

        expiry_date = new Date();
        expiry_date = new Date(expiry_date.setSeconds(expiry_date.getSeconds() + parseInt(postdata.expires_in)));
            
        callback(postdata.access_token, expiry_date, postdata.refresh_token);
    },

    getSpotifySession: async function (callback) {
        const {REACT_APP_SPOTIFY_CLIENT_ID, REACT_APP_SPOTIFY_CLIENT_SECRET} = process.env;

        const baseURL = "https://accounts.spotify.com/api/token";
        let postdata = null;
        let expiry_date = null;

        const authHeader = (REACT_APP_SPOTIFY_CLIENT_ID + ":" + REACT_APP_SPOTIFY_CLIENT_SECRET);

        await axios
            .post(baseURL, {
                grant_type: "client_credentials"
            },
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(authHeader, 'utf8').toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                postdata = response.data;
            });

        console.log(postdata)

        expiry_date = new Date();
        expiry_date = new Date(expiry_date.setSeconds(expiry_date.getSeconds() + parseInt(postdata.expires_in)));

        callback(postdata.access_token, expiry_date);
    },

    getLastFmSongs: async function(start_date, end_date, name, callback) {
        const { REACT_APP_LASTFM_API_KEY } = process.env;
        
        const baseURL = "https://ws.audioscrobbler.com/2.0/";
        let postdata = null;

        await axios
            .post(baseURL, {
                method: 'user.getrecenttracks',
                api_key: REACT_APP_LASTFM_API_KEY,
                user: name,
                from: Math.floor(parseInt(start_date)),
                to: Math.floor(parseInt(end_date)),
                extended: 0,
                limit: 100,
                format: 'json'
            },
            {
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
                }
            })
            .then((response) => {
                postdata = response.data
            });

        console.log(
            postdata
        )

        callback(postdata);
    },

    getDeezerSongs: async function(token, callback) {
        const baseURL = "https://api.deezer.com/user/me";
        let postdata = null;

    }
}

