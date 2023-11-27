import React, { useState } from 'react';
//port that our backend uses
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

console.log("API URL is: " + URL);


const ResetButton = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const initiateTables = async () => {
        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const resultData = await response.text();
                setResult(resultData);
            } else {
                setError(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <button onClick={initiateTables}>Reset</button>
            {result && <div>Result: {result}</div>}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default ResetButton;