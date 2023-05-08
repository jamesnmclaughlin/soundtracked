import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFunction, getStravaActivities, getStravaActivityInfo } from '../functions/functions';
import Logo from '../Logo';
import ProgressBar from '../progress-bar';

export default function Loading() {

    const navigate = useNavigate();

    const running_mov = require('../../resources/running-2.m4v');
    const running_webm = require('../../resources/running-1.webm');

    const [percentage, setPercentage] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const fetchData = async () => {

        let resultJSON = [];
        let hasHeartRateCounter = 0;
        let average_distance = 0;
        let average_heartrate = 0;
        let average_elevation_change = 0;
        let average_speed = 0;
        let allData = [];
        let counter = 0;

        const stravaActivities = await getStravaActivities();

        for (let activity of stravaActivities) {
            
            counter += 1;

            // Ignore Activity If Not a Run
            if (activity.type === "Run") {

                let resultData = [];
                
                // Get Heartrate data from activity if it exists
                if (activity.has_heartrate) {
                    hasHeartRateCounter += 1;
                    average_heartrate += activity.average_heartrate;
                }

                average_distance += activity.distance;
                average_elevation_change += Math.abs(activity.elev_high - activity.elev_low);
                average_speed += activity.average_speed;

                // Convert Activity's Local Start Time to Unix Timestamp (seconds)
                let start_date = Math.floor(new Date(activity.start_date).getTime() / 1000);
                let end_date = null;

                // Get extra activity information such as split metrics
                let activityStream = await getStravaActivityInfo(activity.id)

                let sampling_rate = 100;

                // grab current value
                // check if there are 100 values ahead
                // if no grab end value if not already current
                // if yes grab value 100 ahead
                // work difference between values
                for (let i = 0; i < (activityStream.distance.original_size - 1); i += sampling_rate) {
                    
                    let start_time = activityStream.time.data[i];
                    let start_distance = activityStream.distance.data[i];
                    let end_time = null;
                    let end_distance = null;

                    if (activityStream.distance.original_size > (i + 100) ) {
                        end_time = activityStream.time.data[i+100];
                        end_distance = activityStream.distance.data[i+100];
                    } else {
                        end_time = activityStream.time.data[activityStream.distance.original_size-1];
                        end_distance = activityStream.distance.data[activityStream.distance.original_size-1];
                    }

                    let time_diff = end_time - start_time;
                    let distance_diff = end_distance - start_distance;

                    // Determine Average Pace Metric (s/m)
                    let pace = time_diff / distance_diff;

                    // Check if metric has a adjusted elevation metric 

                    // Find Songs Listened to between each split time

                    // After finding the songs listened to build an object with the metric pace and song features

                    end_date = start_date + time_diff;
                    
                    //if (checkServiceConnection("lastfm")) {
                        await fetch("/get-lastfm-songs?start_date=" + start_date + "&end_date=" + end_date + "&user=" + localStorage.getItem("lastfm_name"))
                            .then(res => res.json())
                            .then(async (data) => {

                                if (data.response.recenttracks.track.length > 0) {
                                    
                                    await searchFunction(pace, data.response.recenttracks.track).then((trackList) => {
                                        resultData = resultData.concat(trackList);
                                        allData = allData.concat(trackList);
                                    });
                                }
            
                            });
                    //}
                    
                    start_date = end_date + 1;
                }

                resultJSON.push({
                    id: activity.id,
                    name: activity.name,
                    start_date: activity.start_date,
                    distance: activity.distance,
                    elapsed_time: activity.elapsed_time,
                    visibility: activity.visibility,
                    activity_metrics: resultData
                });
            }

            setPercentage((counter/stravaActivities.length)*100);
        }

        average_distance = average_distance / stravaActivities.length;
        average_elevation_change = average_elevation_change / stravaActivities.length;
        average_heartrate = average_heartrate / hasHeartRateCounter; 
        average_speed = average_speed / stravaActivities.length;

        navigate('/results', { state: {
            average_distance: average_distance,
            average_elevation_change: average_elevation_change,
            average_heartrate: average_heartrate,
            average_speed: average_speed,
            activity_results: resultJSON,
            all_data: allData
        }});

        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className='background-image-container' id='container-triangle'>
                <div className="container-ground">
                    <Logo />
                    <div className="loading-container">
                        <div id="fetched-runs-container">
                            <video width="600" height="100%" playbackspeed={1.5} loop={true} muted={true} autoPlay={true} playsInline={true}>
                                <source 
                                    src={ running_mov } 
                                    type='video/mp4; codecs="hvc1"'/>
                                <source 
                                    src={ running_webm } 
                                    type="video/webm"/>
                            </video>
                        </div>
                        <div id="loading-details">
                            <h1>Hold on whilst we analyse your runs</h1>
                            <p>This shouldn't take long, we're pacing ourselves.</p>
                        </div>
                        <div id="progress-bar">
                            <ProgressBar percentage={percentage} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}