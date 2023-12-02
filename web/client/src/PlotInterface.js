import './PlotInterface.css';
import Table from "./Table";
import InsertPlotTask from "./InsertPlotTask";
import React, { useState } from 'react';
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const PlotInterface = ({plotID}) => {
    const [gardeners, setGardeners] = useState(null);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    async function onDelete(row) {
        //delete plot task via api call

        setResult(null);
        setError(null);
        console.log("DELETING ROW");
        console.log(row[0]);
        var response = await fetch(URL + "/delete-plot-task",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({TaskNum:row[0], PlotID:row[1]})
        });
        if(response.ok) {
            setError(null);
            const data = await response.json();
            if(data?.data?.message){
                setResult(data.data.message);
            }else{
                setError("Failed to delete row");
            }
        }else{
            var error = await response.json();
            setError(error.error)
        }
        getPlotInfo(plotID);

    }
    //First lets do all our queries.
    async function getPlotInfo(plotID) {
        setGardeners(null);
        const response = await fetch(URL + "/get-plot-info",{
            method: 'POST',
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
    }
        React.useEffect(() => {
        fetch(URL + "/get-plot-info",{
            method: 'POST',
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
                    
                    <Table tableData={{data:gardeners}} tableName="Plot Tasks" onDelete={onDelete}></Table>
                    {result && <div className = 'result' style={{ color: 'green' }}>  {result}</div>}
                    {error && <div className = 'result' style={{ color: 'red' }}>Error: {error}</div>}

                    
                    <div className="insert-interface">
                        {/*insert component here*/}
                        <InsertPlotTask PlotID={plotID} OnInsert={getPlotInfo}/>
                    </div>

            </div>
        );
    };

export default PlotInterface;