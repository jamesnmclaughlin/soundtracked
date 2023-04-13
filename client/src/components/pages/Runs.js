import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import GetRuns from '../get-runs';

function Runs() {

    return (
        <div className="background-image-container" id="container-runs">
            <div className="container-ground">
                <Logo />
                <div className="flex-container">
                    <div id="progress-bar">

                    </div>
                    <div id="fetched-runs-container">
                        <GetRuns />
                    </div>
                    <div id="fetched-runs-info-container">

                        <Link className="button-main" to={'/loading'}>Continue</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Runs;