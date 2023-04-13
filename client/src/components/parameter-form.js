import React, {useState} from 'react';

export default function Parameters({ addParams }) {

    const [tempo, setTempo] = useState(1);
    const [loudness, setLoudness] = useState(0);
    const [key, setKey] = useState(0);
    const [acousticness, setAcousticness] = useState(0);
    const [speechiness, setSpeechiness] = useState(0);

    const handleSubmit = (e) => {
        addParams({
            tempo: tempo,
            loudness: loudness,
            key: key,
            acousticness: acousticness,
            speechiness: speechiness
        });
        console.log("submitted")
        e.preventDefault();
    }

    return (
        <form id="parameterForm" onSubmit={e => { handleSubmit(e) }}>
            <input name="tempo" type="number" step="1" min="1" value={ tempo } onChange={e => setTempo(parseInt(e.target.value))} />
            <input name="loudness" type="number" step="1" min="-60" value={ loudness } onChange={e => setLoudness(parseInt(e.target.value))}/>
            <input name="key" type="number" step="1" min="0" max="11" value={key} onChange={e => setKey(parseInt(e.target.value))}/>
            <input name="acousticness" type="number" step="1" min="0" max="100" value={acousticness} onChange={e => setAcousticness(parseInt(e.target.value))} />
            <input name="speechiness" type="number" step="1" min="0" max="100" value={speechiness} onChange={e => setSpeechiness(parseInt(e.target.value))} />
            <button className="button-main" type="submit">Submit</button>
        </form>
    )
}