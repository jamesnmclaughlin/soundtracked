import React, { useState, useEffect} from 'react';
import { useLocation, Link } from 'react-router-dom';
import Logo from '../Logo';

const secondsToText = (time) => {
    let hours = time / 3600;
    let hoursRounded = Math.floor(hours);
    let minutes = (hours - hoursRounded) * 60;
    let minutesRounded = Math.round(minutes);

    let hourText = "hr"
    if (hoursRounded != 1) {
        hourText += "s"
    }
    let minText = "min"
    if (minutesRounded != 1) {
        minText += "s"
    }
    
    return (
        hoursRounded + hourText + " " + minutesRounded + minText
    );
}

export default function Results() {
    const { state } = useLocation();
    const { 
        average_distance, 
        average_elevation_change,
        average_heartrate,
        average_speed,
        activity_results,
        all_data 
    } = state;
    
    const [selectedRuns, updateSelectedRuns] = useState([activity_results[0].id]);

    const activityClick = (id) => {
        let index = selectedRuns.toString().indexOf(id);
        if (index > -1) {
            updateSelectedRuns(selectedRuns.filter(index => index != id));
        } else {
            updateSelectedRuns(selectedRuns.concat(id));
        }
    }

    useEffect(() => {
        const selectData = activity_results.filter(activity => selectedRuns.toString().indexOf(activity.id) > -1);
    });

    const activities = activity_results.map((activity, index) => 
        <div className={ selectedRuns.includes(activity.id) ? 'run selected' : 'run' } key={ index + 1 } onClick={() => {activityClick(activity.id)} }>
            <span className="count">{index + 1}</span>
            <div className="information">
                <div>
                    <span className="title">{ activity.name }</span>
                    <span>{ secondsToText(activity.elapsed_time) }</span>
                    <span>{ (activity.distance/1000).toFixed(2) + "km" }</span>
                </div>
                <span className="date">23rd September 2023</span>
                <div className="icon strava-logo"></div>
            </div>
        </div>
    )

    return (
        <div className='background-image-container' id='container-home'>
            <div className="container-ground">
                <Logo />
                <div className="results-container">
                    <div id="left">
                        <div id="average-data">
                            <div className="data-item">
                                <p>Average Heart Rate</p>
                                <div>
                                    <span className="value">{Math.round(average_heartrate)}</span>
                                    <div className="measurement">
                                        <div className="icon heart"></div>
                                        <span className="units">bpm</span>
                                    </div>
                                </div>
                            </div>
                            <div className="data-item">
                                <p>Average Speed</p>
                                <div>
                                    <span className="value">{average_speed.toFixed(1)}</span>
                                    <div className="measurement">
                                        <div className="icon speed"></div>
                                        <span className="units">mph</span>
                                    </div>
                                </div>
                            </div>
                            <div className="data-item">
                                <p>Average Elevation Change</p>
                                <div>
                                    <span className="value">{average_elevation_change}</span>
                                    <div className="measurement">
                                        <div className="icon elevation"></div>
                                        <span className="units">ft</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="run-list">
                            { activities }
                        </div>
                    </div>
                    <div id="right">
                        <div id="results-container">
                            <div id="parameter-select">
                                <select>

                                </select>
                                <span></span>
                                <select>

                                </select>
                            </div>
                            <div id="graph"></div>
                        </div>
                        <div id="actions">
                            <Link className="button-main button-black" to={'/'}>I'm Done</Link>
                            <Link className="button-main" to={'/recommendations'}>Get Recommendations</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}