import './PlotInterface.css';
import Table from "./Table";
import React, { useState } from 'react';
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const PlotInterface = ({plotID}) => {
    //First lets do all our queries.
        const [gardeners, setGardeners] = useState(null);
        React.useEffect(() => {
        fetch(URL + "/get-plot-info",{
            method: 'POST', // or 'PUT', depending on the API requirement
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'plotID':plotID})
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.data?.plotTasks) {
                setGardeners(data.data.plotTasks);
            }
        });
    }, [plotID]);
      
          //Things we want:
          /*
            List of tasks associated with plot
            List of previously planted crops?
            Insert plot task?
            Delete plot task?
            Update plot task?
            Gardeners who have worked on this plot? join

          */
          return (
            <div className="plot-interface">

                    <h1>
                        Plot {plotID}
                    </h1>
                    
                    <h1>
                        
                    </h1>
                    
                    <Table tableData={{data:gardeners}} tableName="Plot Tasks"></Table>
            </div>
        );
    };

export default PlotInterface;