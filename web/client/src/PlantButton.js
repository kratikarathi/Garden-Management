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

    const groupByPlot = () => {
        fetch(`${URL}/get-tasks-by-plot`)
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
                setError('Failed to group');
            });
    };

    const plotsHavingTasks = () => {
        fetch(`${URL}/get-plots-having-tasks`)
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
                setError('Failed to group');
            });
    };

    const buildingSupplyCount = () => {
        fetch(`${URL}/get-buildings-supply-count`)
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
                setError('Failed to group');
            });
    };

    const updatePlotTasks = async () => {
        console.log("dog");

        const oldNumValue = document.getElementById('updateOldNum').value;
        const oldIDValue = document.getElementById('updateOldID').value;
        const descValue = document.getElementById('updateDesc').value;
        const deadlineValue = document.getElementById('updateDate').value;
        const sinValue = document.getElementById('updateSin').value;
        const statValue = document.getElementById('updateStat').value;
        console.log("hi cat");
        console.log(deadlineValue);
        console.log(JSON.stringify({
            oldNum: oldNumValue,
            oldID: oldIDValue,
            desc: descValue,
            date: deadlineValue,
            sin: sinValue,
            stat: statValue
        }));

        try {
            const response = await fetch(`${URL}/update-plots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldNum: oldNumValue,
                    oldID: oldIDValue,
                    desc: descValue,
                    date: deadlineValue,
                    sin: sinValue,
                    stat: statValue
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update plot tasks');
            }

            const text = await response.text();
            setResult(text);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='plant-button'>
            <button onClick={getPlotTasks}>View Plot Task Info</button>
            {result && <div className='result' style={{ color: 'green' }}>{result}</div>}
            {error && <div className='result' style={{ color: 'red' }}>Error: {error}</div>}

            <div className='building'>
                <h3> Search Building name with the minimum average supply count </h3>
                <button onClick={buildingSupplyCount}> Search </button>
            </div>

            {viewedTasks && (
                <form id="updataPlotTasks" onSubmit={updatePlotTasks}>
                    Task Number: <input type="number" id="updateOldNum" placeholder="Enter Task Number" required /> <br /><br />
                    Plot ID: <input type="number" id="updateOldID" placeholder="Enter Plot ID" required /> <br /><br />
                    Description: <input type="text" id="updateDesc" placeholder="Enter New Description" maxLength="20" /> <br /><br />
                    Deadline: <input type="date" id="updateDate" placeholder="Enter New Deadline" maxLength="20" /> <br /><br />
                    SIN: <input type="text" id="updateSin" placeholder="Enter New SIN" maxLength="20" /> <br /><br />
                    Status: <input type="text" id="updateStat" placeholder="Complete" maxLength="20" /> <br /><br />

                    <button type="submit">Update Plot Task Info</button><br/>
                </form>
            )}

            {viewedTasks && (
                <div className='group-by'>
                    <h3> Check how many tasks are currently registered for each plot</h3>
                    <button onClick={groupByPlot}> Search </button>
                </div>
            )}
            {viewedTasks && (
                <div className='having'>
                    <h3> See plot id's of plots having at least one task </h3>
                    <button onClick={plotsHavingTasks}> Search </button>
                </div>
)}
        </div>
    );
};

export default PlantButton;
