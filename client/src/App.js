import React, { useEffect } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import {reconnectService, checkServiceConnection} from './components/functions/functions';

import Home from './components/pages/Home';
import Connect from './components/pages/Connect';
import Loading from './components/pages/Loading';
import Runs from './components/pages/Runs';
import Recommendations from './components/pages/Recommendations';

import Test from './components/pages/Test';

import Handle from './components/handlers/Handle';

const services = ["strava", "fitbit", "deezer", "lastfm"];

export default function App() {
    
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
                <Route path='/recommendations' element={<Recommendations />}/> 

                <Route path='/test' element={<Test />}/>

                <Route path='*' element={ NoMatch() }/>
            </Routes>
        </div>
    );
}


function NoMatch() {
    return (
        <div>
            <h1>Not Found</h1>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    );
} 