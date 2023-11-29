import React, { useState, useEffect } from 'react';
import './PlantButton.css';

const PORT = process.env.REACT_APP_API_PORT;
const URL = `http://localhost:${PORT}/api`; // URL of our backend

const PlantButton = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState(null);

    useEffect(() => {
        fetch(`${URL}/get-plot-tasks`)
            .then((res) => res.json())
            .then((tasks) => setTasks(tasks))
            .catch((err) => console.error('Error fetching tasks:', err));
    }, []); // Add URL to the dependency array

    const GetPlotTasks = () => {
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
            {result && <div className='result' style={{ color: 'green' }}>{result}</div>}
            {error && <div className='result' style={{ color: 'red' }}>Error: {error}</div>}
        </div>
    );
};

export default PlantButton;
