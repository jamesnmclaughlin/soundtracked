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
    
    const [x_variable, updateXVariable] = useState("bpm");
    const [x_unit, updateXUnit] = useState("bpm");
    const [x_title, updateXTitle] = useState("Tempo");
    const [y_variable, updateYVariable] = useState("pace");
    const [y_title, updateYTitle] = useState("Pace");

    const [y_description, updateYDescription] = useState("Time taken to complete a kilometre (MM:SS). Pace is the time taken to cover a specified distance, often measured per kilometre or per mile.");
    const [x_description, updateXDescription] = useState("Tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.");


    const seed_data = all_data.sort(function(a, b){ return a.pace - b.pace;}).slice(0,5);
    let trackIds = [];

    let averageTempo = 0
    let averageLoudness = 0
    let averageKey = 0
    let averageAcousticness = 0
    let averageSpeechiness = 0

    seed_data.map((track) => { 
        trackIds.push(track.id); 

        averageTempo += track.bpm
        averageLoudness += track.loudness
        averageKey += track.key
        averageAcousticness += track.acousticness
        averageSpeechiness += track.speechiness

    });

    averageTempo = Math.round(averageTempo / seed_data.length);
    averageLoudness = Math.round(((averageLoudness / seed_data.length) + Number.EPSILON) * 100) / 100;
    averageKey = Math.round(averageKey / seed_data.length);
    averageAcousticness = Math.round(((averageAcousticness / seed_data.length) + Number.EPSILON) * 100) / 100;
    averageSpeechiness = Math.round(((averageSpeechiness / seed_data.length) + Number.EPSILON) * 100) / 100;

    trackIds = trackIds.join(",");


    // Filtering the runs based on the filter set
    const [runFilter, updateRunFilter] = useState(false);

    if (runFilter) {
        activity_results = activity_results.filter(activity => activity.activity_metrics.length > 0);
    }

    // Run selection process
    const [selectedRuns, updateSelectedRuns] = useState([activity_results[0].id]);

    const selectData = activity_results.filter(activity => selectedRuns.toString().indexOf(activity.id) > -1);

    const activityClick = (id) => {
        let index = selectedRuns.toString().indexOf(id);
        if (index > -1) {
            updateSelectedRuns(selectedRuns.filter(index => index !== id));
        } else {
            updateSelectedRuns(selectedRuns.concat(id));
        }
    }

    // Creating the HTML component for listing all activities
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
                                <select onChange={(e) => { updateYDescription(e.target.options[e.target.selectedIndex].dataset.description); updateYVariable(e.target.options[e.target.selectedIndex].value); updateYTitle(e.target.options[e.target.selectedIndex].innerText); } }>
                                    <option data-description="Time taken to complete a kilometre (MM:SS). Pace is the time taken to cover a specified distance, often measured per kilometre or per mile." value="pace">Pace</option>
                                </select>
                                <p>{ y_description }</p>
                                <span></span>
                                <select id="x-parameter" onChange={(e) => { updateXDescription(e.target.options[e.target.selectedIndex].dataset.description); updateXUnit(e.target.options[e.target.selectedIndex].dataset.unit);updateXVariable(e.target.options[e.target.selectedIndex].value); updateXTitle(e.target.options[e.target.selectedIndex].innerText); }} >
                                    <option data-description="Tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration." data-unit="bpm" value="bpm">Tempo</option>
                                    <option data-description="The overall loudness of a track in decibels (dB). The larger the negative value, the quieter the track." data-unit="dB" value="loudness">Loudness</option>
                                    <option data-description="The key the track is in. E.g. C, C#/D♭, D." data-unit="" value="key">Key</option>
                                    <option data-description="Percentage energy of a track. It represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy." data-unit="%" value="energy">Energy</option>
                                    <option data-description="Danceability describes the percentage a track is suitable for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity." data-unit="%" value="danceability">Danceability</option>
                                    <option data-description="The presence of spoken words in a track. The more speech-like the recording (e.g. talk show, audio book, poetry), the higher the percentage. Above 66% describe tracks probably made entirely of spoken words. Between 33% and 66% describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Below 33% most likely represent music and other non-speech-like tracks." data-unit="%" value="speechiness">Speechiness</option>
                                    <option data-description="Acousticness describes the confidence percentage that a track is accoustic." data-unit="%" value="acousticness">Acousticness</option>
                                </select>
                                <p>{ x_description }</p>
                            </div>
                            <div id="graph">
                                <Graph 
                                    data={ selectData } 
                                    x_title={ x_title }
                                    x_variable={ x_variable } 
                                    y_title={ y_title }
                                    y_variable={ y_variable }
                                    x_unit={ x_unit }
                                />
                            </div>
                        </div>
                        <div id="actions">
                            <Link className="button-main button-black" to={'/'}>I'm Done</Link>
                            <Link className="button-main" 
                                to={'/recommendations'} 
                                state={{ 
                                    trackIds: trackIds,
                                    init_temp : averageTempo,
                                    init_loud : averageLoudness,
                                    init_key : averageKey,
                                    init_acou : averageAcousticness,
                                    init_spee : averageSpeechiness
                                }}>
                                Get Recommendations
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}