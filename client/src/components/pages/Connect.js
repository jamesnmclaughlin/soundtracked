import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import Service from '../service';


function Connect() {
    const [value, setValue] = useState(0);
    const [clickable, setClickable] = useState(true);

    const disconnectService = (service) => {
        localStorage.removeItem(service + "_access_token");
        localStorage.removeItem(service + "_refresh_token");
        localStorage.removeItem(service + "_expiry_date");

        if (service === "fitbit") { localStorage.removeItem("fitbitCV"); }
        if (service === "lastfm") { localStorage.removeItem("lastfm_name"); }
        setValue(value + 1);
    }

    useEffect(() => {

        if (false) {
            setClickable(false);
        }
    })

    return (
        <div className='background-image-container' id='container-gradient'>
            <div className="container-ground">
                <Logo />
                <div className="flex-container">
                    <div id="services-container">
                        <div id="services">
                            <Service type="running" api="strava" disconnectService={disconnectService}/>
                            <Service type="running" api="fitbit" disconnectService={disconnectService}/>
                            <Service type="music" api="lastfm" disconnectService={disconnectService}/>
                        </div>
                    </div>
                    <div id="service-info-container">
                        <div id="service-info">
                            <h1>Connect Your Services</h1>
                            <p>In order for you to analyse your running performance vs. listening history, you'll need to connect <b>one</b> run-tracking service and <b>one</b> music-tracking service.</p>
                            <div id="service-info-icons">
                                <div className="service-info-icon">
                                    <p>music =</p>
                                    <img alt="Music API service indicator" width="80px" src={require('../../resources/headphones.png')}/>
                                </div>
                                <div className="service-info-icon">
                                    <p>running =</p>
                                    <img alt="Running API service indicator" width="80px" src={require('../../resources/running.png')}/>
                                </div>
                            </div>
                            <Link style={{pointerEvents: clickable ? '' : 'none'}} className="button-main" to={'/loading'} >Continue</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Connect;