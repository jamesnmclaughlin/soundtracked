import React, { useCallback, useState} from 'react';
import Recommendation from '../recommendation';
import Parameters from '../parameter-form';

function Recommendations() {

    const [params, setParams] = useState({});

    const addParams = useCallback((data) => {
        setParams(data);
    }, []);

    return (
        <div className="background-image-container" id="container-gradient">
            <div className="container-ground">
                <div id="parameter-container">
                    <Parameters addParams={addParams}/>
                </div>
                <div id="recommendations-container">
                    <Recommendation params={params} />
                </div>
            </div>
        </div>
    );
}

export default Recommendations;

