import React, { useState, useEffect } from 'react';
import './PlantButton.css';
import Table from "./Table";
const PORT = process.env.REACT_APP_API_PORT;
const URL = `http://localhost:${PORT}/api`; // URL of our backend

const PlantButton = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState(null);


    const GetPlotTasks = () => {
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
            });
    };

    const UpdatePlot = () => {
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
            <button onClick={GetPlotTasks}>View Plot Task Info</button>
            {result && <Table tableData={result}/>}
            {error && <div className='result' style={{ color: 'red' }}>Error: {error}</div>}
        </div>
    );
};

export default PlantButton;
