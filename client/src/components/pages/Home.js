import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';


function Home() {

    const services = ["strava", "fitbit", "deezer", "lastfm"];
    
    services.forEach(service_name => {
        if (service_name === "fitbit") {
            localStorage.removeItem(service_name + "CV");
        }
        if (service_name === "lastfm") {
            localStorage.removeItem(service_name + "_name");
        }
        localStorage.removeItem(service_name + "_access_token");
        localStorage.removeItem(service_name + "_refresh_token");
        localStorage.removeItem(service_name + "_expiry_date");
    })

    return(
        <div className="background-image-container" id="container-waves">
            <div className="container-ground">
                <Logo />

                <div className="flex-container">
                    <div id='home-featured'>
                        <h1 id='title'>Does the music you listen to make you run <span>faster?</span></h1>
                        <p id='detailed'>SoundTracked looks to solve the common problem whether the music you listen to is helping your running performance and provide music to maintain or improve your pace.</p>
                        <Link className="button-main" to={'/connect'}>Try It Now</Link>
                    </div>
                    <div id='home-graphic'>
                        <div id="image"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;