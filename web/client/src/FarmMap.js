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
                {plots ? (
                    plots.data.rows.map(plot => {
                        return (
                            <div
                                key={plot[0]}
                                className="plot"
                                style={{
                                    left: `${plot[2]}%`,
                                    top: `${plot[3]}%`,
                                    width: `${plot[0]}%`,
                                    height: `${plot[1]}%`
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