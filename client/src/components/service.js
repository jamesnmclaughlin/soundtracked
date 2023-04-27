import React from 'react';
import { getServiceID, checkServiceConnection } from './functions/functions';

const crypto = require('crypto');
const hex2dec = require('hex2dec');
const base64url = require('base64url');

export default function Service(props) {

    if (checkServiceConnection(props.api)) {
        return (
            <div className="service">
                <div className={"service-img " + props.api}></div>
                <div className={"service-type " + props.type}></div>
                <a className="service-connect connected" href="#">Connected</a>
            </div>
        );
    }
    
    return (
        <div className="service">
            <div className={"service-img " + props.api}></div>
            <div className={"service-type " + props.type}></div>
            <a className="service-connect" href={connectURL(props.api)}>Connect</a>
        </div>
    );
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
    console.log(code)
    localStorage.setItem('fitbitCV', code);

    return code;
}