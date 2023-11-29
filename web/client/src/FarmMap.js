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
          const plotRows = plots?.data?.rows;
          var scale = 5.0;
          return (
            <div className="farm-map">
                {plotRows ? ( plotRows.map(plot => {
                        return (
                            <div
                                key={plot[0]}
                                className="plot"
                                style={{
                                    left: `${plot[3]*scale}px`,
                                    top: `${plot[4]*scale}px`,
                                    width: `${plot[1]*scale}px`,
                                    height: `${plot[2]*scale}px`
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