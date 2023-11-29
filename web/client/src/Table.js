import React from 'react';

function Table({tableData}) {
    //First we need to parse our data
    
    const metaData = tableData?.data?.metaData; //make sure data exists
    const rows = tableData?.data?.rows;
    if(!metaData) { //if metadata doesnt exist then return nothing
        return <div>Loading...</div>
    }
    return (
        <table>
            <thead>
                <tr>
                    {metaData.map(columnName => {
                        return(
                            <th>
                                {columnName.name}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                
                {rows.map(row => {
                    return(
                        <tr> 
                        {
                        row.map(cell => {
                            return(
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

    );
}
export default Table;