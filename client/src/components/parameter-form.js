import React, {useState} from 'react';

export default function Parameters({ addParams, init_temp, init_key, init_loud, init_acou, init_spee }) {

    const [tempo, setTempo] = useState(init_temp);
    const [loudness, setLoudness] = useState(init_loud);
    const [key, setKey] = useState(init_key);
    const [acousticness, setAcousticness] = useState(Math.round(init_acou*100));
    const [speechiness, setSpeechiness] = useState(Math.round(init_spee*100));

    const handleSubmit = (e) => {
        addParams({
            tempo: tempo,
            loudness: loudness,
            key: key,
            acousticness: Math.round(((acousticness/100) + Number.EPSILON) * 100) / 100,
            speechiness: Math.round(((speechiness/100) + Number.EPSILON) * 100) / 100
        });
        console.log("submitted")
        e.preventDefault();
    }

    return (
        <form id="parameterForm" onSubmit={e => { handleSubmit(e) }}>
            <label for="tempo">Tempo (bpm)</label>
            <input name="tempo" type="number" step="1" min="1" value={ tempo } onChange={e => setTempo(parseInt(e.target.value))} />
            <label for="loudness">Loudness (dB)</label>
            <input name="loudness" type="number" step="0.01" min="-60" value={ loudness } onChange={e => setLoudness(parseInt(e.target.value))}/>
            <label for="key">Key (0-11 where 0=C and 11=A)</label>
            <input name="key" type="number" step="1" min="0" max="11" value={key} onChange={e => setKey(parseInt(e.target.value))}/>
            <label for="acousticness">Acousticness (%)</label>
            <input name="acousticness" type="number" step="1" min="0" max="100" value={acousticness} onChange={e => setAcousticness(parseInt(e.target.value))} />
            <label for="speechiness">Speechiness (%)</label>
            <input name="speechiness" type="number" step="1" min="0" max="100" value={speechiness} onChange={e => setSpeechiness(parseInt(e.target.value))} />
            <button className="button-main" type="submit">Submit</button>
        </form>
    )
}