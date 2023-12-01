import React, { useState, useEffect } from 'react';
import './PlantButton.css';
import Table from "./Table";
const PORT = process.env.REACT_APP_API_PORT;
const URL = `http://localhost:${PORT}/api`; // URL of our backend

const Projection = () => {
    const [selected, setSelected] = useState("");
    const [tableNames, setTableNames] = useState(null);
    const [checkBoxes,setCheckBoxes] = useState(null);
    const [table, setTable] = useState(null);
    const [error, setError] = useState(null);
    var checkboxes = [];
    async function handleDropDownChange(event) {
        setTable(null);
        setError(null);
        setSelected(event.target.value);
        //we want to create some checkboxes now
        //First lets get the column headers of the table we want to project on
        const response = await fetch(URL + "/get-headers",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({tableName:event.target.value})
        });
        const tableHeaders = await response.json();
        var checkboxes = []; //reset array
        tableHeaders.headers.forEach(tableName => {
            checkboxes.push({label: tableName, checked: true});
        });
        setCheckBoxes(checkboxes);
    }
    const handleCheckBoxChange = (index) => {
        setError(null);
        setTable(null);
        setCheckBoxes(null);
        var updatedCheckBoxes = checkBoxes.map((checkbox,i) =>{
            if(i == index) {
                checkbox.checked = !checkbox.checked;
            }
            return (checkbox); 
        }
        );
        setCheckBoxes(updatedCheckBoxes);
    }
    React.useEffect(() => {
        fetch(URL + "/get-table-names")
            .then((res) => res.json())
            .then((tableNames) => setTableNames(tableNames));
    }, []);
    const tableNameRows = tableNames?.data?.rows;
    if (!tableNameRows) {
        return <div>Loading...</div>
    }
  

    async function viewTables(){
        setTable(null);
        setError(null);
        if(selected == "") {
            setError("Select a table first!");
            return;
        }
        var headers = []
        checkBoxes.map((checkbox) =>{
            if(checkbox.checked) {
                headers.push(checkbox.label[0]);
            }
        }
        );
        var response = await fetch(URL + "/projection",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({tableName:selected, headers:headers })
        });
        if(response.ok) {
            setError(null);
            const data = await response.json();
            setTable(data);
        }else{
            var error = await response.json();
            setError(error.error)
        }
    };



    return (
        <div className="Projection">
            <div className="tableSelectDropdown">
                <select value={selected} onChange={handleDropDownChange}>
                    <option value="">Select Table</option>
                    {tableNameRows.map(tableName => {
                        return (
                            <option value={tableName}>
                                {tableName}
                            </option>
                        )
                    })}
                </select>
            </div>
            <div className ="projectionCheckBoxes">
                {checkBoxes? checkBoxes.map((checkbox,index) => {
                    return(<label>
                        <input type="checkbox"
                        checked = {checkbox.checked}
                        onChange= {() => handleCheckBoxChange(index)}>
                        </input>
                        {checkbox.label}
                    </label>);
                    }): ""}
            </div>
            
            <button onClick={viewTables}>View Table</button>
            {error && <div className = 'result' style={{ color: 'red' }}>Error: {error}</div>}
            {table?<Table tableData = {table}/>: <></>}
        </div>
    );
};

export default Projection;
