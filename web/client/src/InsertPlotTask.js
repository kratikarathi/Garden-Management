//port that our backend uses
import React, { useState } from 'react';
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const InsertPlotTask = ({ PlotID,OnInsert}) => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [viewedTasks, setViewedTasks] = useState(false);

    /*
    upon rendering we'll need a list of sin and their corrosponding gardener name
    We'll need
    */
    async function insertPlotTasks(event) {
        event.preventDefault();
        setResult(null);
        const descValue = document.getElementById('insertDesc').value;
        const deadlineValue = document.getElementById('insertDate').value;
        const sinValue = document.getElementById('insertSin').value;
        // Sending data to the backend
        const response = await fetch(URL + '/insert-plot-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                PlotID: PlotID,
                TaskDescription: descValue,
                Deadline: deadlineValue,
                SIN: sinValue,
            })
        });
        if (response.ok) {
            setError(null);
            const data = await response.json();
            if (data?.data?.message) {
                setResult(data.data.message);
            } else {
                setError("Failed to insert data");
            }
        } else {
            var error = await response.json();
            setError(error.error)
        }
        OnInsert(PlotID);
    }


    return (
        <div className="Insert-Interface">
            <h1>
                Insert New Plot Task
            </h1>
            <form id="InsertPlotTask" onSubmit={insertPlotTasks}>
                Description: <input type="text" id="insertDesc" placeholder="Enter Description" maxLength="20" /> <br /><br />
                Deadline: <input type="date" id="insertDate" placeholder="Enter Deadline" maxLength="20" /> <br /><br />
                SIN: <input type="text" id="insertSin" placeholder="Enter SIN" maxLength="20" /> <br /><br />
                <button type="submit">Insert</button>
                {result && <div className='result' style={{ color: 'green' }}>  {result}</div>}
                {error && <div className='result' style={{ color: 'red' }}>Error: {error}</div>}
            </form>
        </div>
    );
};


export default InsertPlotTask;