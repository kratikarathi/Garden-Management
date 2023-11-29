import './FarmMap.css';
import React, { useState } from 'react';
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const FarmMap = () => {
    const [plots, setPlots] = useState(null);
    const [buildings, setBuildings] = useState(null);
        React.useEffect(() => {
            fetch(URL + "/get-plots/")
              .then((res) => res.json())
              .then((plots) => setPlots(plots));
          }, []);
          return (
            <div className="farm-map">
                {plots.data.rows ? (
                    plots.data.rows.map(plot => {
                        return (
                            <div
                                key={plot[0]}
                                className="plot"
                                style={{
                                    left: `${plot[3]}%`,
                                    top: `${plot[4]}%`,
                                    width: `${plot[1]}%`,
                                    height: `${plot[2]}%`
                                }}
                            >
                            <p>{plot[0]}</p>
                            </div>
                            
                        );
                    })
                ) : "Loading"}
            </div>
        );
    };

export default FarmMap;