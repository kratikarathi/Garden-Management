import React, { useState } from 'react';
import './PlantButton.css';

const PORT = process.env.REACT_APP_API_PORT;
const URL = `http://localhost:${PORT}/api`; // URL of our backend

const PlantButton = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [viewedTasks, setViewedTasks] = useState(false);

    const getPlotTasks = () => {
        setResult('Viewing...');
        setError(null);
        fetch(`${URL}/get-plot-tasks`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('status: ' + response.status);
                }
                return response.text();
            })
            .then((text) => {
                setResult(text);
            })
            .catch((err) => {
                setError('not displaying plot tasks');
                console.error(err);
            })
            .finally(() => setViewedTasks(true));
    };

    const updatePlot = () => {
        setResult('Viewing...');
        setError(null);
        fetch(`${URL}/update-plot`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('status: ' + response.status);
                }
                return response.text();
            })
            .then((text) => {
                setResult(text);
            })
            .catch((err) => {
                setError('not updating plot');
            });
    };

    return (
        <div className='plant-button'>
            <button onClick={getPlotTasks}>View Plot Task Info</button>
            {result && <div className='result' style={{ color: 'green' }}>{result}</div>}
            {error && <div className='result' style={{ color: 'red' }}>Error: {error}</div>}

            {viewedTasks && (
                <form id="updataPlotTasks" onSubmit={updatePlotTasks}>
                    Task Number: <input type="number" id="updateOldNum" placeholder="Enter Task Number" required /> <br /><br />
                    Plot ID: <input type="number" id="updateOldID" placeholder="Enter Plot ID" required /> <br /><br />
                    Description: <input type="text" id="updateDesc" placeholder="Enter New Description" maxLength="20" /> <br /><br />
                    SIN: <input type="text" id="updateSin" placeholder="Enter New SIN" maxLength="20" /> <br /><br />
                    Status: <input type="text" id="updateStat" placeholder="Complete" maxLength="20" /> <br /><br />

                    <button type="submit">Update Plot Task Info</button><br/>
                </form>
            )}
        </div>
    );
};

// Updates plot task
async function updatePlotTasks(event) {
    event.preventDefault();
    console.log("dog");

    const oldNumValue = document.getElementById('updateOldNum').value;
    const oldIDValue = document.getElementById('updateOldID').value;
    const descValue = document.getElementById('updateDesc').value;
    const sinValue = document.getElementById('updateSin').value;
    const statValue = document.getElementById('updateStat').value;
    console.log("hi cat");
    console.log(oldNumValue + oldIDValue + descValue + sinValue + statValue);
    console.log(JSON.stringify({
        oldNum: oldNumValue,
        newID: oldIDValue,
        desc: descValue,
        sin: sinValue,
        stat: statValue
    }));

    const response = await fetch('/update-plots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldNum: oldNumValue,
            newID: oldIDValue,
            desc: descValue,
            sin: sinValue,
            stat: statValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
    } else {
        messageElement.textContent = "Error updating name!";
    }
}
export default PlantButton;
