import React from 'react';
import video from '../../resources/running-1.webm';

function Loading() {
    return (
        <div id="loading-container">
            <video width="320" height="240" autoPlay muted loop>
                <source src={video} type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default Loading;