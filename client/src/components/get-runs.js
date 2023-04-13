import React, { useEffect } from 'react';
import { checkServiceConnection, reconnectService } from './functions/functions';
import time from '../resources/time.png';
import distance from '../resources/distance.png';
import elevation from '../resources/elevation.png';
import calendar from '../resources/calendar.png';

const baseURL = "https://www.strava.com/api/v3";

export default function GetRuns() {

    const [postdata, setPostData] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true); 
    const apiFunction = "/athlete/activities";

    const fetchData = () => {
        if (checkServiceConnection("strava")) {

            fetch(baseURL + apiFunction, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("strava_access_token")
                }
            })
            .then(res => res.json())
            .then((response) => {

                setPostData(response);

                setLoading(false);
            })
            .catch((err) => console.log("error"));
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <div><p style={{color: '#000'}}>Loading...</p></div>
    }

    const activities = postdata.map((activity) => 
        <div key={ activity.id } className="run" >
            <div className=""><img className="icon" src={calendar} alt='info-icon'/>{ new Date(activity.start_date).toLocaleString().split(',')[0]}</div>
            <div><img className="icon" src={time} alt='info-icon'/>{ new Date(parseInt(activity.elapsed_time) * 1000).toISOString().slice(11, 19) }</div>
            <div><img className="icon" src={distance} alt='info-icon'/>{ (parseInt(activity.distance)/1000).toFixed(2) }km</div>
            <div><img className="icon" src={elevation} alt='info-icon'/>{ activity.total_elevation_gain.toFixed(0) }ft</div>
        </div>
    );

    return activities;
}
