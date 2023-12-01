import './FarmMap.css';
import React, { useState } from 'react';
import PlotInterface from './PlotInterface';
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const FarmMap = () => {

    const [plots, setPlots] = useState(null);
    const [buildings, setBuildings] = useState(null);
    const [view, setView] = useState(null);
    async function handlePlotClick(plotID) {
        var view = ({type: 'plot', ID: plotID});
        setView(view);
        console.log(view);
    }
    async function handleBuildingClick(buildingID) {
        var view = ({type: 'building', ID: buildingID});
        setView(view);
        console.log(view);
    }
        React.useEffect(() => {
            fetch(URL + "/get-plots/")
              .then((res) => res.json())
              .then((plots) => setPlots(plots));
          }, []);
          React.useEffect(() => {
            fetch(URL + "/get-table",{
                method: 'POST', // or 'PUT', depending on the API requirement
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tableName:'Building'})
            })
              .then((res) => res.json())
              .then((buildings) => setBuildings(buildings));
          }, []);
          const plotRows = plots?.data?.rows;
          const buildingRows = buildings?.data?.rows;
          var scale = 5.0;
          return (
            <div className = "body">
           
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
                                onClick={() => handlePlotClick(plot[0])}
                            >
                            <p>{plot[0]}</p>
                            </div>
                            
                        );
                    })
                ) : "Loading"}

                {buildingRows ? ( buildingRows.map(building => {
                        return (
                            <div
                                key={building[0]}
                                className="building"
                                style={{
                                    left: `${building[5]*scale}px`,
                                    top: `${building[6]*scale}px`,
                                    width: `${building[3]*scale}px`,
                                    height: `${building[4]*scale}px`
                                }}
                                onClick={() => handleBuildingClick(building[0])}
                            >
                            <p>{building[0]}</p>
                            </div>
                            
                        );
                    })
                ) : "Loading"}
           
            </div>  
            {view?.type == 'plot' ? <PlotInterface plotID = {view.ID}/> : ""}
            {view?.type == 'plot' ? "": ""}
            </div>
        );
    };

export default FarmMap;