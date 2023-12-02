import React, { useState } from 'react';
import './AggregatedReports.css';
import Table from "./Table";
const PORT = process.env.REACT_APP_API_PORT;
const URL = `http://localhost:${PORT}/api`; // URL of our backend

const AggregatedReports = () => {
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
                return response.json();
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
        setError(null);
        fetch(`${URL}/get-tasks-by-plot`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('status: ' + response.status);
                }
                return response.json();
            })
            .then((text) => {
                setResult(text);
            })
            .catch((err) => {
                setError('Failed to group');
            });
    };

    const plotsHavingTasks = () => {
        setError(null);
        fetch(`${URL}/get-plots-having-tasks`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('status: ' + response.status);
                }
                return response.json();
            })
            .then((text) => {
                setResult(text);
            })
            .catch((err) => {
                setError('Failed to group');
            });
    };

    const buildingSupplyCount = () => {
        setError(null);
        fetch(`${URL}/get-buildings-supply-count`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('status: ' + response.status);
                }
                return response.json();
            })
            .then((text) => {
                setResult(text);
            })
            .catch((err) => {
                setError('Failed to group');
            });
    };
    return (
        <div className='plant-button'>
            <button onClick={getPlotTasks}>View Plot Task Info</button>
            {result && <Table tableData={result}/>}
            {error && <div className='result' style={{ color: 'red' }}>Error: {error}</div>}

            {(
                <div className='group-by'>
                    <h3> Check how many tasks are currently registered for each plot</h3>
                    <button onClick={groupByPlot}> Search </button>
                </div>
            )}
            {(
                <div className='having'>
                    <h3> See buildings containing less than 15 total supplies</h3>
                    <button onClick={plotsHavingTasks}> Search </button>
                </div>
)}
            <div className='buildingMin'>
                <h3> Search Building name with the minimum average supply count </h3>
                <button onClick={buildingSupplyCount}> Search </button>
            </div>

        </div>
    );
};

export default AggregatedReports;
