import React, { useState} from 'react';
import { useLocation, Link } from 'react-router-dom';

import Graph from '../graph';

import Logo from '../Logo';

const secondsToText = (time) => {
    let hours = time / 3600;
    let hoursRounded = Math.floor(hours);
    let minutes = (hours - hoursRounded) * 60;
    let minutesRounded = Math.round(minutes);

    let hourText = "hr"
    if (hoursRounded !== 1) {
        hourText += "s"
    }
    let minText = "min"
    if (minutesRounded !== 1) {
        minText += "s"
    }
    
    return (
        hoursRounded + hourText + " " + minutesRounded + minText
    );
}

const nth = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
}

const formatOrdinalDate = (date) => {
    date = new Date(date)
    const formattedDate = date.toLocaleString('en-GB', { month: "long", year: "numeric" });

    const day = date.getDate();
    
    return (day + nth(day) + " " + formattedDate);
}

export default function Results() {
    const { state } = useLocation();
    let { 
        average_distance, 
        average_elevation_change,
        average_heartrate,
        average_speed,
        activity_results,
        all_data 
    } = state;
    
    const [selectedRuns, updateSelectedRuns] = useState([activity_results[0].id]);
    const [runFilter, updateRunFilter] = useState(false);

    const [x_variable, updateXVariable] = useState("bpm");
    const [x_title, updateXTitle] = useState("Tempo");
    const [y_variable, updateYVariable] = useState("pace");
    const [y_title, updateYTitle] = useState("Pace");

    const activityClick = (id) => {
        let index = selectedRuns.toString().indexOf(id);
        if (index > -1) {
            updateSelectedRuns(selectedRuns.filter(index => index !== id));
        } else {
            updateSelectedRuns(selectedRuns.concat(id));
        }
    }

    const selectData = activity_results.filter(activity => selectedRuns.toString().indexOf(activity.id) > -1);

    if (runFilter) {
        activity_results = activity_results.filter(activity => activity.activity_metrics.length > 0);
    }

    const activities = activity_results.map((activity, index) => 
        <div className={ selectedRuns.includes(activity.id) ? 'run selected' : 'run' } key={ index + 1 } onClick={() => {activityClick(activity.id)} }>
            <span className="count">{index + 1}</span>
            <div className="information">
                <div>
                    <span className="title">{ activity.name }</span>
                    <span>{ secondsToText(activity.elapsed_time) }</span>
                    <span>{ (activity.distance/1000).toFixed(2) + "km" }</span>
                </div>
                <span className="date">{ formatOrdinalDate(activity.start_date) }</span>
                <div className="icon strava-logo"></div>
            </div>
        </div>
    )

    return (
        <div className='background-image-container' id='container-waves'>
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
                        <div id="run-filters">
                            <div className={ !runFilter ? "filter-button selected" : "filter-button"} onClick={() => { updateRunFilter(false) }}>
                                <span>All Runs</span>
                            </div>
                            <div className={ runFilter ? "filter-button selected" : "filter-button"} onClick={() => { updateRunFilter(true) }}>
                                <span>Contains Music Activity</span>
                            </div>
                        </div>
                        <div id="run-list">
                            { activities }
                        </div>
                    </div>
                    <div id="right">
                        <div id="results-container">
                            <div id="parameter-select">
                                <select onChange={(e) => { updateYVariable(e.target.options[e.target.selectedIndex].value); updateYTitle(e.target.options[e.target.selectedIndex].innerText); } }>
                                    <option value="pace">Pace</option>
                                </select>
                                <span></span>
                                <select onChange={(e) => { updateXVariable(e.target.options[e.target.selectedIndex].value); updateXTitle(e.target.options[e.target.selectedIndex].innerText); }} >
                                    <option value="bpm">Tempo</option>
                                    <option value="loudness">Loudness</option>
                                    <option value="key">Key</option>
                                    <option value="energy">Energy</option>
                                    <option value="danceability">Danceability</option>
                                    <option value="speechiness">Speechiness</option>
                                    <option value="acousticness">Acousticness</option>
                                </select>
                            </div>
                            <div id="graph">
                                <Graph 
                                    data={ selectData } 
                                    x_title={ x_title }
                                    x_variable={ x_variable } 
                                    y_title={ y_title }
                                    y_variable={ y_variable }
                                />
                            </div>
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