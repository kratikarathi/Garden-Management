import './FarmMap.css';
import React, { useState } from 'react';
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const PlotInterface = ({plotID}) => {

    const [plots, setPlots] = useState(null);
    const [buildings, setBuildings] = useState(null);

    async function handlePlotClick(plotID) {
        console.log(plotID);
    }
    async function handleBuildingClick(buildingID) {
        console.log(buildingID);
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

          //Things we want:
          /*
            List of tasks associated with plot
            List of previously planted crops?
            Insert plot task?
            Delete plot task?
            Update plot task?
            Gardeners who have worked on this plot?
            
          */
          return (
            <div className="plot-interface">
                
            </div>
        );
    };

export default PlotInterface;