import React from 'react';
import { getServiceID, checkServiceConnection, connectURL } from './functions/functions';

export default function Service(props) {
    const {api, type, disconnectService} = props;

    if (checkServiceConnection(api)) {
        return (
            <div className="service">
                <div className={"service-img " + api}></div>
                <div className={"service-type " + type}></div>
                <button className="service-connect connected" onClick={() => { disconnectService(api) }}><span>Connected</span></button>
            </div>
        );
    }
    
    return (
        <div className="service">
            <div className={"service-img " + api}></div>
            <div className={"service-type " + type}></div>
            <a className="service-connect" href={connectURL(api)}>Connect</a>
        </div>
    );
}