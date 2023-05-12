import React from 'react';
import { Route, Routes, Navigate} from "react-router-dom";
import {reconnectService, checkServiceConnection} from './components/functions/functions';

import Home from './components/pages/Home';
import Connect from './components/pages/Connect';
import Loading from './components/pages/Loading';
import Runs from './components/pages/Runs';
import Recommendations from './components/pages/Recommendations';
import Results from './components/pages/Results';

import Handle from './components/handlers/Handle';


export default function App() {
    
    const services = ["strava", "fitbit", "deezer", "lastfm"];
    
    services.forEach(service_name => {
        if (!checkServiceConnection(service_name)) {
            reconnectService(service_name);
        }
    });

    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/connect' element={<Connect />} />
                <Route path='/strava' element={<Handle service_name="strava" />}/>  
                <Route path='/fitbit' element={<Handle service_name="fitbit" />}/>  
                <Route path='/lastfm' element={<Handle service_name="lastfm" />}/>  
                <Route path='/deezer' element={<Handle service_name="deezer" />}/>  
                <Route path='/choose-runs' element={<Runs />} />
                <Route path='/loading' element={<Loading />}/> 
                <Route path='/results' element={<Results />}/> 
                <Route path='/recommendations' element={<Recommendations />}/> 

                <Route path='*' element={ <Navigate to="/" /> }/>
            </Routes>
        </div>
    );
}