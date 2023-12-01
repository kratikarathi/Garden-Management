import React from 'react';
import './Table.css';
function Table({ tableData, tableName }) {
    //First we need to parse our data

    const metaData = tableData?.data?.metaData; //make sure data exists
    const rows = tableData?.data?.rows;
    if (!metaData) { //if metadata doesnt exist then return nothing
        return <div>Loading...</div>
    }
    return (
        <div>
             {tableName && <h2>{tableName}</h2>}
            <table>
                <thead>
                    <tr>
                        {metaData.map((columnName, i) => {
                            if (columnName.name == "") {
                                return;
                            }
                            return (
                                <th key={i}>
                                    {columnName.name}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>

                    {rows.map(row => {
                        return (
                            <tr>
                                {
                                    row.map(cell => {
                                        return (
                                            <td>
                                                {cell}
                                            </td>
                                        );
                                    })
                                }
                            </tr>)
                    })}
                </tbody>
            </table>
        </div>
    );
}
export default Table;