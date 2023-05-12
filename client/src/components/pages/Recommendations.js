import React, { useCallback, useState} from 'react';
import Recommendation from '../recommendation';
import Parameters from '../parameter-form';
import { useLocation, Link } from 'react-router-dom';
import Logo from '../Logo';

function Recommendations() {

    const [params, setParams] = useState({});

    const addParams = useCallback((data) => {
        setParams(data);
    }, []);

    const { state } = useLocation();
    let { trackIds, init_temp, init_key, init_loud, init_acou, init_spee} = state;

    return (
        <div className="background-image-container" id="container-gradient">
            <div id="recommendation-button-container">
                <Link className="button-main button-black button-recommendations">I'm Done</Link>
            </div>
            <div className="container-ground">
                <Logo />
                <div id="parameter-container">
                    <Parameters addParams={addParams} init_temp={init_temp} init_key={init_key} init_loud={init_loud} init_acou={init_acou} init_spee={init_spee}/>
                </div>
                <div id="recommendations-container">
                    <Recommendation params={params} seedTracks={trackIds} />
                </div>
            </div>
        </div>
    );
}

export default Recommendations;

