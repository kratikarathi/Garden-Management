import React, { useState, useEffect } from 'react';
import './PlantButton.css';
import Table from "./Table";
const PORT = process.env.REACT_APP_API_PORT;
const URL = `http://localhost:${PORT}/api`; // URL of our backend
const Selection = () => {
    const [table, setTable] = useState(null);
    const [tableNames, setTableNames] = useState(null);
    const [selected, setSelected] = useState(null);
    const [conditions, setConditions] = useState([{conjugate:"", column: "", operation: "", value: "" }]);
    const [error, setError] = useState(null);
    //column: operation: value:

    function changeCondition(index, field, value) {
        const newConditions = conditions.map((condition, i) => {
            if (i == index) {
                return { ...condition, [field]: value };
            }
            return condition;
        });
        setConditions(newConditions);
    }
    function addCondition() {
        if(!selected) {
            return;
        }
        setConditions([...conditions, {conjugate:"AND", column: "", operation: "", value: "" }])
    }
    function removeCondition(index) {
        var newConditions = [];
        conditions.map((condition, i) => {
            if (i != index) {
                if(index===0 && i ===1){
                    condition.conjugate = ""
                }
                newConditions.push(condition);
            }
           
        });
        setConditions(newConditions);
    }

    async function filter() {
        var response = await fetch(URL + "/selection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tableName: selected,  conditions: conditions})
        });
        if(response.ok) {
            setError(null);
            const table = await response.json();
            setTable(table);
        }else{
            var error = await response.json();
            setError(error.error)
        }
       
    }
    async function handleDropDownChange(event) {
        setTable(null);
        setSelected(event.target.value);
        setConditions([{conjugate:"", column: "", operation: "", value: "" }]);
        var response = await fetch(URL + "/get-table", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tableName: event.target.value })
        });
        const table = await response.json();
        setTable(table);
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

    return (
        <div className="Selection">
            <div className="tableSelectDropdown">
                <select value={selected} onChange={handleDropDownChange}>
                    <option value="">Select Table</option>
                    {tableNameRows.map((tableName,i) => {
                        return (
                            <option key = {i} value={tableName}>
                                {tableName}
                            </option>
                        )
                    })}
                </select>
            </div>
            <div className="conditions">
                { table?.data?.metaData? conditions.map((condition, index) =>
                        <div>
                                {index !== 0 ?  <select
                                value={condition.conjugate}
                                onChange={(e) => changeCondition(index, 'conjugate', e.target.value)}
                                >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                            </select> : ""} 
                             <select
                                value={condition.column}
                                onChange={(e) => changeCondition(index, 'column', e.target.value)}
                            >
                                 <option value="">Select column</option>
                                {table.data.metaData.map((header) =>
                                    <option value={header.name}>{header.name}</option>
                                )
                                }
                            </select>
                           
                            <select
                                value={condition.operation}
                                onChange={(e) => changeCondition(index, 'operation', e.target.value)}
                            >
                                <option value="">Select operation</option>
                                <option value="=">=</option>
                                <option value="<">&lt;</option>
                                <option value=">">&gt;</option>
                                <option value="<=">&le;</option>
                                <option value=">=">&ge;</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Value"
                                value={condition.value}
                                onChange={(e) => changeCondition(index, 'value', e.target.value)}
                            />
                            <button onClick={() => removeCondition(index)}>Remove</button>
                        </div>
                    )
                    : <div></div>
                }
            </div>
            <button onClick={filter}>Filter</button>
            <button onClick={addCondition}>Add Conditon</button>
            {error && <div className = 'result' style={{ color: 'red' }}>Error: {error}</div>}
            {table ? <Table tableData={table} /> : <></>}
        </div>
    );
};

export default Selection;
