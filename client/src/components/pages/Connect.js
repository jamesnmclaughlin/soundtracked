import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import Service from '../service';


function Connect() {
    return (
        <div className='background-image-container' id='container-connect'>
            <div className="container-ground">
                <Logo />
                <div className="flex-container">
                    <div id="progress-bar">

                    </div>
                    <div id="services-container">
                        <div id="services">
                            <Service type="running" api="strava" />
                            <Service type="running" api="fitbit" />
                            <Service type="music" api="lastfm" />
                            <Service type="music" api="deezer" />
                        </div>
                    </div>
                    <div id="service-info-container">
                        <div id="service-info">
                            <h1>Connect Your Services</h1>
                            <p>In order for you to analyse your running performance vs. listening history, you'll need to connect at <b>least one</b> run-tracking service and at <b>least one</b> music-tracking service.</p>
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
                            <Link className="button-main" to={'/choose-runs'} >Continue</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Connect;