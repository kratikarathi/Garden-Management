//port that our backend uses
import React, { useState } from 'react';
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

const InsertButton = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [viewedTasks, setViewedTasks] = useState(false);
   /*const insertTable = () => {
        setResult("Inserting into tables...");
        setError(null);
        fetch(URL+ '/insert-plottable')
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
                setError('Failed to insert into table');
            })
            .finally(() => setViewedTasks(true));
    };*/

    async function insertPlotTasks(event) {
        event.preventDefault();
        console.log("evaluating");

        const NumValue = document.getElementById('insertNum').value;
        const IDValue = document.getElementById('insertID').value;
        const descValue = document.getElementById('insertDesc').value;
        const deadlineValue = document.getElementById('insertDate').value;
        const sinValue = document.getElementById('insertSin').value;
        const statValue = document.getElementById('insertStat').value;
        console.log("inserting");
        console.log(JSON.stringify({
            Num: NumValue,
            ID: IDValue,
            desc: descValue,
            date: deadlineValue,
            sin: sinValue,
            stat: statValue
        }));

        try {
            // Sending data to the backend
            const response = await fetch(URL + '/insert-plottable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Num: NumValue,
                    ID: IDValue,
                    desc: descValue,
                    date: deadlineValue,
                    sin: sinValue,
                    stat: statValue
                })
            });

            if (!response.ok) {
                throw new Error('Failed to insert into table');
            }

            const responseData = await response.text();
            setResult(responseData);
        } catch (error) {
            console.error('Error inserting data:', error);
            setError('Failed to insert into table');
        } finally {
            setViewedTasks(true);
        }
    };


    return (
        <div className="insert-button">
            <form id="insertplottasks" onSubmit={insertPlotTasks}>
                Task Number: <input type="number" id="insertNum" placeholder="Enter Task Number" required /> <br /><br />
                Plot ID: <input type="number" id="insertID" placeholder="Enter Plot ID" required /> <br /><br />
                Description: <input type="text" id="insertDesc" placeholder="Enter Description" maxLength="20" /> <br /><br />
                Deadline: <input type="date" id="insertDate" placeholder="Enter Deadline" maxLength="20" /> <br /><br />
                SIN: <input type="text" id="insertSin" placeholder="Enter SIN" maxLength="20" /> <br /><br />
                Status: <input type="text" id="insertStat" placeholder="Complete" maxLength="20" /> <br /><br />

                <button type="submit">Insert</button>
            </form>
        </div>
    );
};


export default InsertButton;