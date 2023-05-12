import React, { useEffect } from 'react';
import { checkSpotifyConnection, getSeeds } from './functions/functions';

const baseURL = "https://api.spotify.com/v1/";

export default function Reccomendation(props) {
    const { seedTracks } = props;
    const apiFunction = "recommendations?";

    const [postdata, setPostData] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const [params, setParams] = React.useState(props.params);
    const [hookValue, setHookValue] = React.useState(0);

    const tempo = parseInt(params.tempo);
    const loudness = parseInt(params.loudness);
    const key = parseInt(params.key);
    let acousticness = parseInt(params.acousticness);
    let speechiness = parseInt(params.speechiness);

    const reload = () => {
        setHookValue(hookValue => hookValue + 1);
        console.log("reload function active, value:" + hookValue);
        fetchData()
    }

    const fetchData = async () => {
        if (checkSpotifyConnection()) {
            
            const seedArtists = "";
            const seedGenres = "";
            let parameters = "";

            // TEMPO
            if (!isNaN(tempo)) {
                if (tempo <= 5) { parameters += "&min_tempo=0"; }
                else { parameters += "&min_tempo=" + (tempo-5); }
                parameters += "&max_tempo=" + (tempo+5);
            }
            
            // LOUDNESS
            if (!isNaN(loudness)) {
                if (loudness <= -55) { parameters += "&min_loudness=-60"; } 
                else { parameters += "&min_loudness=" + (loudness-5); }
                parameters += "&max_loudness=" + (loudness+5);
            }

            // KEY
            if (!isNaN(key)) {
                if (key === 0) { parameters += "&min_key=0"; } 
                else { parameters += "&min_key=" + (key-1); }

                if (key === 11) { parameters += "&max_key=11"; } 
                else { parameters += "&max_key=" + (key+1); }
            }

            // ACOUSTICNESS
            if (!isNaN(acousticness)) {
                acousticness = acousticness/100;

                if (acousticness <= 5) { parameters += "&min_acousticness=0"; } 
                else { parameters += "&min_acousticness=" + (acousticness-5); }
    
                if (acousticness >= 95) { parameters += "&max_acousticness=100"; } 
                else { parameters += "&max_acousticness=" + (acousticness+5); }
            }

            // SPEECHINESS
            if (!isNaN(speechiness)) {
                speechiness = speechiness/100;

                if (speechiness <= 5) { parameters += "&min_speechiness=0"; } 
                else { parameters += "&min_speechiness=" + (speechiness-5); }
    
                if (speechiness >= 95) { parameters += "&max_speechiness=100"; } 
                else { parameters += "&max_speechiness=" + (speechiness+5); }
            }

            fetch(baseURL + apiFunction + "seed_tracks=" + seedTracks + "&seed_artists=" + seedArtists + "&seed_genres=" + seedGenres + parameters, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("spotify_access_token"),
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then((response) => {
                setPostData(response.tracks);
                setLoading(false);
            })
            .catch((err) => console.log("error"));
        }
    }

    useEffect(() => {
        setParams(props.params);
        fetchData();
    }, [props.params]);

    if (isLoading) {
        return <div><button onClick={reload}>Reload</button></div>
    }
    
    const recommendations = postdata.map((recommendation) => 
        <div key={recommendation.id} className="song" >
            <img src={recommendation.album.images[1].url} alt={recommendation.album.name}/>
            <div>
                <h2>{recommendation.name}</h2>
                <p>{recommendation.artists[0].name}</p>
            </div>
        </div>
    );

    return recommendations;
}