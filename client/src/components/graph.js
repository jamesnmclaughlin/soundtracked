import React, { useState, useEffect} from 'react';
import { Chart } from "react-google-charts";

export default function Graph(props) {
    const { data, y_variable, x_variable, x_title, y_title, x_unit } = props;

    let extrapolatedData = [[x_title, y_title, {'type': 'string', 'role': 'tooltip', 'p': {'html': true}} ]];
    for (let activity of data) {
        for (let metric of activity.activity_metrics) {
            extrapolatedData.push([ x_unit==="%" ? metric[x_variable]*100 : metric[x_variable], metric[y_variable], createCustomHTMLContent(metric, x_variable, y_variable, x_title, y_title, x_unit) ]);
        }
    }

    if (extrapolatedData.length > 1) {
        const datapoints = extrapolatedData.slice(1).sort(function(a, b){ return a[1] - b[1];})
        const min = datapoints.shift()[1];
        const max = datapoints.pop()[1];
        let ticks = []
        let songKeys = [{v: -1, f: "No Key"},{v: 0, f: "C"},{v: 1, f: "C#/D♭"},{v: 2, f: "D"},{v: 3, f: "D#/E♭"},{v: 4, f: "E"},{v: 5, f: "F"},{v: 6, f: "F#/G♭"},{v: 7, f: "G"},{v: 8, f: "G#/A♭"},{v: 9, f: "A"},{v: 10, f: "A#/B♭"},{v: 11, f: "B"}]
        
        for (let i = min-0.05; i <= max + 0.05; i += 0.05) {
            ticks.push({
                v: i,
                f: new Date(parseInt(i * 1000) * 1000).toISOString().slice(14, 19)
            })
        }

        const options = {
            vAxis: { ticks: ticks, title: y_title },
            hAxis: { title: x_unit!=="" ? x_title + " (" + x_unit + ")" : x_title, ticks: x_unit==="" ? songKeys : {} },
            pointSize: 12,
            trendlines: {
                0: {
                type: "polynomial",
                color: "green",
                tooltip: false
                },
            },
            tooltip: { isHtml: true, trigger: 'both'}
        }
        
        const [key, setkey] = useState(false)
        const size = useWindowSize()
      
        useEffect(() => {
          setkey(prevKey => !prevKey)
        }, [size.width])
    
        return (
            <div id="graph-container">
                <Chart 
                    key={key}
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
        <div id="graph-container" style={{ "display": "flex", "justify-content": "center", "font-size":"30px" }}>
            <p>Please select runs that contain music data<br/> in order to view graphed results</p>
        </div>
    )
    
}

// Creates a custom tooltip showing song data with extra information for the user
function createCustomHTMLContent(metric, metric_X, metric_Y, metric_XTitle, metric_YTitle, unit) {
    let x_value = metric[metric_X]

    if (unit === undefined) {
        unit = "";
    } else {
        if (unit === "%") {
            x_value = x_value * 100;
        }
    }

    return(
        "<div style='padding: 20px; width: 190px; height: 350px; text-align: left;'>" +
            "<img style='width: 150px; height: 150px; margin-bottom: 5px;box-shadow: 0px 0px 13px 2px #eaeaea;' src='" + metric["track_information"].album.images[0].url + "'/>" +
            "<h2 style='font-size: 14px; margin:0 0 5px 0;color: #8E8E8E'>" + metric["track_information"].artists[0].name + "</h2>" + 
            "<h1 style='font-size: 18px; margin:0 0 5px 0;color: #000;'>" + metric["track_information"].name + "</h1>" +
            "<p style='font-size: 14px; margin: 0 0 10px 0; color: #000'>" + metric["track_information"].album.name + "</p>" +
            "<div style='color: #000;font-size: 16px;'>" +
                "<span>" + metric_XTitle + ": " + Math.round(x_value * 100) / 100 + " " + unit + "</span><br/>" +
                "<span>" + metric_YTitle + ": " + new Date(parseInt(metric[metric_Y]* 1000) * 1000).toISOString().slice(14, 19) + "</span>" +
            "</div>" +
        "</div>" 
    );

}

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });
    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []); 
    return windowSize;
  }