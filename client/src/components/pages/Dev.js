import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import Logo from '../Logo';

export default function Dev() {

    return (
        <div className='background-image-container' id='container-gradient'>
            <div className="container-ground">
                <Logo />
                <div className="results-container">
                    <div id="left">
                        <div id="average-data">
                            <div class="data-item">
                                <span class="value">111</span>
                                <div class="measurement">
                                    <div class="icon heart"></div>
                                    <span class="units">bpm</span>
                                </div>
                            </div>
                            <div class="data-item">
                                <span class="value">8.5</span>
                                <div class="measurement">
                                    <div class="icon speed"></div>
                                    <span class="units">mph</span>
                                </div>
                            </div>
                            <div class="data-item">
                                <span class="value">27</span>
                                <div class="measurement">
                                    <div class="icon elevation"></div>
                                    <span class="units">ft</span>
                                </div>
                            </div>
                        </div>
                        <div id="run-list">
                            <div className="run">
                                <span className="count">1</span>
                                <div className="information">
                                    <div>
                                        <span className="title">Afternoon Run</span>
                                        <span>1hr 26mins</span>
                                        <span>2.06km</span>
                                    </div>
                                    <span className="date">23rd September 2023</span>
                                    <div className="icon strava-logo"></div>
                                </div>
                            </div>
                            <div className="run">
                                <span className="count">1</span>
                                <div className="information">
                                    <div>
                                        <span className="title">Afternoon Run</span>
                                        <span>1hr 26mins</span>
                                        <span>2.06km</span>
                                    </div>
                                    <span className="date">23rd September 2023</span>
                                    <div className="icon strava-logo"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="right">
                        <div id="results-container">
                            <div id="parameter-select">
                                <select>

                                </select>
                                <span></span>
                                <select>

                                </select>
                            </div>
                            <div id="graph"></div>
                        </div>
                        <div id="actions">
                            <Link className="button-main button-black" to={'/'}>I'm Done</Link>
                            <Link className="button-main" to={'/recommendations'}>Get Recommendations</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}