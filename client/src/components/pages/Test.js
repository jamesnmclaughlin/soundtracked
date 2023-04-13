import React, {useState, useEffect} from 'react';
import { checkServiceConnection, spotifySearch, audioFeatures, getStravaActivities, getStravaActivityInfo } from '../functions/functions';

export default function Test() {
    
    const [response, setResponse] = useState([]);
    const [seedList, setSeedList] = useState("");
    const [isLoading, setLoading] = useState(true)
    let trackInfo = null;

    const searchFunction = async (response) => {
        let seedList = "";
        let trackID = null;

        for (let song of response) {

            let now_playing = false;

            // song.name = track
            // song.artist.name = artist
            // song.album.#text = album

            if (song.hasOwnProperty('@attr')) {
                if (song["@attr"].hasOwnProperty('nowplaying')) {
                    now_playing = song["@attr"].nowplaying;
                }
            }

            if (!now_playing) {


                await spotifySearch(song.artist['#text'], null, null, song.name, function(response) {
                    if (response.tracks.items.length > 0) {
                        trackID = response.tracks.items[0].id;
                    } else {
                        trackID = null;
                    }


                    console.log(song)
                    console.log(trackID)
    
                    if (trackID !== null) {

                        if (seedList !== "") {
                            seedList += ",";
                        }
                        seedList += trackID;
                    }
    
                });
            }
        }
        setSeedList(seedList);
    }

    const fetchData = () => {

        getStravaActivities(function(stravaActivities) {

            let hasHeartRateCounter = 0;
            let average_distance = 0;
            let average_heartrate = 0;
            let average_elevation_change = 0;
            let average_speed = 0;

            stravaActivities.map((activity) => {



                // Ignore Activity If Not a Run
                if (activity.type == "Run") {

                    console.log(activity)

                    if (activity.has_heartrate) {
                        hasHeartRateCounter += 1;
                        average_heartrate += activity.average_heartrate;
                    }

                    average_distance += activity.distance;
                    average_elevation_change += Math.abs(activity.elev_high - activity.elev_low);
                    average_speed += activity.average_speed;

                    // Convert Activity's Local Start Time to Unix Timestamp (seconds)
                    let start_date = Math.floor(new Date(activity.start_date_local).getTime() / 1000);
                    let end_date = null;

                    // Get extra activity information such as split metrics
                    getStravaActivityInfo(activity.id, function(activity) {

                        let sampling_rate = 100;

                        // grab current value
                        // check if there are 100 values ahead
                        // if no grab end value if not already current
                        // if yes grab value 100 ahead
                        // work difference between values
                        // 
                                                
                        for (let i = 0; i < (activity.distance.original_size - 1); i += sampling_rate) {

                            let start_time = activity.time.data[i];
                            let start_distance = activity.distance.data[i];
                            let end_time = null;
                            let end_distance = null;

                            if (activity.distance.original_size > (i + 100) ) {
                                end_time = activity.time.data[i+100];
                                end_distance = activity.distance.data[i+100];
                            } else {
                                end_time = activity.time.data[activity.distance.original_size-1];
                                end_distance = activity.distance.data[activity.distance.original_size-1];
                            }

                            let time_diff = end_time - start_time;
                            let distance_diff = end_distance - start_distance;

                            // Determine Average Pace Metric (s/m)
                            let pace = time_diff / distance_diff;

                            // Convert value to understandable pace
                            let pace_text = new Date(parseInt(pace * 1600) * 1000).toISOString().slice(14, 19)

                            // Check if metric has a adjusted elevation metric 
    
                            // Find Songs Listened to between each split time
    
                            // After finding the songs listened to build an object with the metric pace and song features

    
                            end_date = start_date + time_diff;

                            
                            if (checkServiceConnection("lastfm")) {
                                fetch("/get-lastfm-songs?start_date=" + start_date + "&end_date=" + end_date + "&user=" + localStorage.getItem("lastfm_name"))
                                    .then(res => res.json())
                                    .then(async (data) => {
                                        setResponse(data.response.recenttracks.track);

                                        if (data.response.recenttracks.track.length > 0) {
                                            console.log(pace_text);
                                            //console.log(data.response.recenttracks.track)
                                            await searchFunction(data.response.recenttracks.track);
                                        }
                    
                                        setLoading(false);
                                    });
                            }
                            //console.log("Start Date: " + start_date)
                            //console.log("End Date: " + end_date)
    
                            start_date = end_date;
                        }
                        
                        
                    });

                }


            });
        
            average_distance = average_distance / stravaActivities.length;
            average_elevation_change = average_elevation_change / stravaActivities.length;
            average_heartrate = average_heartrate / hasHeartRateCounter; 
            average_speed = average_speed / stravaActivities.length;

            console.log("Average Distance: " + average_distance);
            console.log("Average Elevation Change: " + average_elevation_change);
            console.log("Average Heart Rate: " + average_heartrate);
            console.log("Average Speed: " + average_speed);
            
        });


        

    }

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return "Loading";
    }

    /*audioFeatures(seedList, function(trackInfo) {
        console.log(trackInfo);
    }); */   

    return (
        <div>
            <p style={{color: '#000'}}>Loaded</p>
        </div>
    )
}