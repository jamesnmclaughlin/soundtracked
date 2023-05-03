import React from 'react';
import { Chart } from "react-google-charts";

export default function Graph(props) {
    const { data, y_variable, x_variable, x_title, y_title } = props;

    let extrapolatedData = [[x_title, y_title]];

    console.log(y_variable, x_variable)

    for (let activity of data) {
        for (let metric of activity.activity_metrics) {
            console.log(metric)
            extrapolatedData.push([metric[x_variable] , metric[y_variable]]);
        }
    }

    const options = {
        chart: {
        },
        vAxis: { title: y_title },
        hAxis: { title: x_title },
        trendlines: {
            0: {
              type: "polynomial",
              color: "green",
            },
        }
    }

    if (extrapolatedData.length > 1) {
        return (
            <div id="graph-container">
                <Chart 
                    chartType="ScatterChart"
                    width="100%"
                    height="100%"
                    data = { extrapolatedData }
                    options = { options }
                />
            </div>
        )
    }

    return (
        <div id="graph-container">
            <p>Please select runs that contain music data in order to view graphed results</p>
        </div>
    )
    
}