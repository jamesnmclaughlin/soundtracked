import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';


function Home() {
    return(
        <div className="background-image-container" id="container-home">
            <div className="container-ground">
                <Logo />
                <div id='home-featured'>
                    <h1 id='title'>Does the music you listen to make you run <span>faster?</span></h1>
                    <p id='detailed'>SoundTracked looks to solve the common problem whether the music you listen to is helping your running performance and provide music to maintain or improve your pace.</p>
                    <Link className="button-main" to={'/connect'}>Try It Now</Link>
                </div>
            </div>
        </div>
    );
}

export default Home;