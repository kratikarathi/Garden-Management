//port that our backend uses
import React, { useState } from 'react';
import "./ResetButton.css";
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const ResetButton = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const resetTables = () => {
        setResult("Resetting Tables...");
        setError(null);
        fetch(URL+ '/reset-tables')
            .then(response => {
                if (!response.ok) {
                    throw new Error('status: ' + response.status);
                }
                return response.text();
            })
            .then(text => {
                setResult(text);
            })
            .catch(err => {
                setError('Failed to reset tables');
            });
    };

    return (
        <div className = 'Reset-button'>
            <button onClick={resetTables}>Reset</button>
            {result && <div className = 'result' style={{ color: 'green' }}>  {result}</div>}
            {error && <div className = 'result' style={{ color: 'red' }}>Error: {error}</div>}
        </div>
    );
};

export default ResetButton;