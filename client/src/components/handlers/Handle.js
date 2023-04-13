import React, { useEffect } from 'react';

export default function Handle(props) {

    const urlParameters = new URLSearchParams(window.location.search);

    const service_name = props.service_name;
    let authcode = null;

    const [isLoading, setLoading] = React.useState(true); 

    switch (service_name) {
        case "strava":
            authcode = urlParameters.get("code");
            break;

        case "fitbit":
            authcode = urlParameters.get("code");
            break;

        case "lastfm":
            authcode = urlParameters.get("token");
            break;

        case "deezer": 
            authcode = urlParameters.get("code");
            break;

        default:
            break;
    }

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            code_verify: localStorage.getItem("fitbitCV"),
            service_name: service_name,
            auth_code: authcode
        })
    }


    useEffect(() => {
        fetch("/get-session", options)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);

                if (data.hasOwnProperty('name')) {
                    localStorage.setItem(service_name + '_name', data.name)
                }
                if (data.hasOwnProperty('token')) {
                    localStorage.setItem(service_name + '_access_token', data.token);
                }
                if (data.hasOwnProperty('exp_date')) {
                    localStorage.setItem(service_name + '_expiry_date', data.exp_date);
                }
                if (data.hasOwnProperty('refresh_token')) {
                    localStorage.setItem(service_name + '_refresh_token', data.refresh_token);
                }
                setLoading(false);
            });
      
    }, []);
    
    if (isLoading) {
        return <div><p style={{color: '#000'}}>Loading...</p></div>
    }
  
    return (
        <div>
            <p style={{color: '#000'}}>{ "Access Token: " + localStorage.getItem(service_name + '_access_token') }</p>
            <p style={{color: '#000'}}>{ "Name: " + localStorage.getItem(service_name + '_name') }</p>
            <p style={{color: '#000'}}>{ "Expiry Date: " + localStorage.getItem(service_name + '_expiry_date') }</p>
            <p style={{color: '#000'}}>{ "Refresh Token: " + localStorage.getItem(service_name + '_refresh_token') }</p>
        </div>
    );
      
}
