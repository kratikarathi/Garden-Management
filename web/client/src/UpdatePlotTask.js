//port that our backend uses
import React, { useState } from 'react';
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const UpdatePlotTask = ({ PlotID,OnUpdate}) => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [viewedTasks, setViewedTasks] = useState(false);

    /*
    upon rendering we'll need a list of sin and their corrosponding gardener name
    We'll need
    */
    async function updatePlotTasks(event) {
        event.preventDefault();
        setResult(null);
        const taskNumValue = document.getElementById('TaskNum').value;
        const descValue = document.getElementById('TaskDescription').value;
        const deadlineValue = document.getElementById('Deadline').value;
        const sinValue = document.getElementById('SIN').value;
        const statusValue = document.getElementById('Status').value;
        // Sending data to the backend
        const response = await fetch(URL + '/update-plot-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                PlotID: PlotID,
                TaskNum: taskNumValue,
                TaskDescription: descValue,
                Deadline: deadlineValue,
                SIN: sinValue,
                Status:statusValue
            })
        });
        if (response.ok) {
            setError(null);
            const data = await response.json();
            if (data?.data?.message) {
                setResult(data.data.message);
            } else {
                setError("Failed to update data");
            }
        } else {
            var error = await response.json();
            setError(error.error)
        }
        OnUpdate(PlotID);
    }


    return (
        <div className="Update-Interface">
            <h1>
                Update Plot Task
            </h1>
            <form id="UpdatePlotTask" onSubmit={updatePlotTasks}>
                    Task Number: <input type="number" id="TaskNum" placeholder="Enter Task Number" required /> <br /><br />
                    New Description: <input type="text" id="TaskDescription" placeholder="Enter New Description" maxLength="20" /> <br /><br />
                    New Deadline: <input type="date" id="Deadline" placeholder="Enter New Deadline" maxLength="20" /> <br /><br />
                    New SIN: <input type="text" id="SIN" placeholder="Enter New SIN" maxLength="20" /> <br /><br />
                    New Status: <input type="text" id="Status" placeholder="Complete" maxLength="20" /> <br /><br />
                <button type="submit">Update</button>
                {result && <div className='result' style={{ color: 'green' }}>  {result}</div>}
                {error && <div className='result' style={{ color: 'red' }}>Error: {error}</div>}
            </form>
        </div>
    );
};


export default UpdatePlotTask;