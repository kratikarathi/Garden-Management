const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('../.env');
//oracledb.initOracleClient({libDir: "/Users/madpenner/oracle/instantclient/instantclient_19_8"});
// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 1,
    poolIncrement: 1
};


async function initialize() {
    try {
        await oracledb.createPool(dbConfig);
        console.log("Connection pool created");
    } catch (err) {
        console.error("Error creating connection pool", err);
        process.exit(1);
    }
}

async function shutdown() {
    try {
        await oracledb.getPool().close(10); // Close the pool
        console.log("Connection pool closed");
        process.exit(0);
    } catch (err) {
        console.error("Error during shutdown", err);
        process.exit(1);
    }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

initialize();
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function test(query) {
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result;
    })
}

async function getTableNames() {
    console.log("Getting list of all Tables");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT table_name FROM user_tables
        `
        );
        return result;
    });
}

async function deletePlotTask(taskNum, plotID) {
    console.log("Deleting plot task");
    const query = 'DELETE FROM PlotTask WHERE TaskNum = :taskNum AND PlotID = :plotID';
    const params = { taskNum: taskNum, plotID: plotID };
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query, params, { autoCommit: true });
        if (result.rowsAffected > 0) {
            return { message: `${result.rowsAffected} rows deleted` };
        } else {
            return { message: 'No rows deleted' };
        }
    });

}


//insert a task into plotTask
async function insertPlotTask(PlotID, TaskDescription, Deadline, SIN) {

    const query = `INSERT INTO PlotTask (TaskNum, PlotID, TaskDescription, SIN, Deadline) VALUES (:TaskNum, :PlotID, :TaskDescription, :SIN, TO_DATE(:Deadline,'YYYY-MM-DD'))`;
    console.log(query);
    return await withOracleDB(async (connection) => {
        //First lets find what our taskNum should be
        var result = await connection.execute(`SELECT MAX(TaskNum) AS MaxTaskNum FROM PlotTask WHERE PlotID = ${PlotID}`);
        var TaskNum = result.rows[0][0] !== null ? result.rows[0][0] + 1 : 1;
        const params = { TaskNum: TaskNum, PlotID: PlotID, TaskDescription: TaskDescription, Deadline: Deadline, SIN: SIN };

        result = await connection.execute(query, params, { autoCommit: true });
        if (result.rowsAffected > 0) {
            return { message: `${result.rowsAffected} row inserted` };
        } else {
            return { message: 'Failed to insert row.' };
        }
    })
}

//JOIN (query 1 joins)
async function getPlotInfo(plotID) {
    const query1 = `
    SELECT DISTINCT  pt.TaskNum as "Task Number", pt.PlotID, c.PersonName as "Gardener Name",g.SIN as "Gardener SIN", pt.TaskDescription as "Description", pt.Deadline as "Deadline", pt.Status as "Status"
    FROM PlotTask pt, Gardener g, CommunityMember c
    WHERE pt.PlotID = ${plotID} AND pt.SIN = g.SIN AND c.SIN = g.SIN
    ORDER BY pt.Deadline
    `;
    const query2 = `
    SELECT *
    FROM Plot p
    WHERE p.PlotID = ${plotID}
    `;
    console.log(query1);
    console.log(query2);
    return await withOracleDB(async (connection) => {
        const result1 = await connection.execute(query1);
        const result2 = await connection.execute(query2);
        return { plotTasks: result1, plotInfo: result2 };
    });
}

async function getTable(tableName) {
    const query = `SELECT * FROM ${tableName}`
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result;
    });
}

async function getTableHeaders(tableName) {
    const query = `SELECT COLUMN_NAME FROM ALL_TAB_COLUMNS
                WHERE TABLE_NAME = '${tableName}'`
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result;
    });
}


//Select and project columns[]
async function projection(tableName, columns) {
    if (columns.length == 0) {
        throw new Error('Columns cannot be empty!');
    }
    const query = `SELECT ${columns.map(column => { return (column) })} FROM ${tableName}`
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result;
    });
}
//Select and project columns[]
async function selection(tableName, conditions) {
    console.log(conditions);
    const query = `SELECT * FROM ${tableName}
    WHERE ${conditions.map((condition) => { return condition.conjugate + ' ' + condition.column + condition.operation + condition.value }).join('')}`
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result;
    });
}

async function getTableNames() {
    console.log("Getting list of all Tables");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT table_name FROM user_tables
        `
        );
        return result;
    });
}

// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    console.log("Checking DB connection!");
    return await withOracleDB(async (connection) => {
        return true;
    });
}

//function to read file with drop,create and insert statement
const fs = require('fs').promises

async function insertCommunityMember(Sin, Name, Email) {
    const result = await connection.execute(
        `INSERT INTO CommunityMember VALUES (:Sin, :Name, :Email)`,
        { Sin, Name, Email }
    );
}

async function getPlots() {
    console.log("Getting plots");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT * From Plot
        `
        );
        return result;
    });
}

async function getPlotTasksStatus() {
    console.log("Getting plot tasks");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT * From PlotTask
        `
        );
        return result;
    });
}
// GROUP BY
async function getTasksByPlot() {
    console.log("Getting tasks by plot id");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT PlotID, COUNT(TaskNum) From PlotTask GROUP BY PlotID
        `
        );
        return result;
    }).catch(() => {
        return false;
    });
}
// HAVING
async function getPlotsHavingTasks() {
    console.log("Getting Buildings containing ");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Building.BuildingName, SUM(Supply.SupplyCount) AS "Total Supply Count"
                                                FROM Building
                                                Join Supply ON Building.BuildingName = Supply.BuildingName
                                                GROUP BY Building.BuildingName
                                                HAVING SUM(Supply.SupplyCount) < 15
        `
        );
        return result;
    }).catch((e) => {
        throw new Error('Failed: ' + e);
    });
}
// Find those buildings for which their average supply count is the
// minimum over all buildings
// nested GROUP BY
async function getBuildingsSupplyCount() {
    console.log("Getting tasks by plot id and ");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT BuildingName, avg(SupplyCount)
        FROM Supply
        GROUP BY BuildingName
        HAVING avg(SupplyCount) <= all (SELECT AVG(SupplyCount)
                                FROM Supply
                                GROUP BY BuildingName)
        `
        );
        return result;
    }).catch((e) => {
        throw new Error('Failed: ' + e);
    });
}

// Find supplies that are in all buildings.
// DIVISION
async function division() {
    console.log("Getting supplies that are in all buildings.");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT s.SupplyType
            FROM SupplyInformation s
            WHERE NOT EXISTS ((SELECT b.BuildingName FROM Building b)
                                MINUS
                                (SELECT s1.BuildingName FROM Supply s1 WHERE s1.SupplyType=s.SupplyType))
            `
        );
        return result;
    }).catch((e) => {
        throw new Error('Failed: ' + e);
    });
}


// UPDATE
async function updatePlots(PlotID, TaskNum, TaskDescription, Deadline, SIN, Status) {

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PlotTask 
            SET TaskDescription = :TaskDescription, Deadline = TO_DATE(:Deadline, 'YYYY-MM-DD'), SIN = :SIN, status = :Status
            WHERE PlotId = :PlotID AND TaskNum = :TaskNum`,
            { TaskNum, PlotID, TaskDescription, Deadline, SIN, Status },
            { autoCommit: true }
        );

        if (result.rowsAffected > 0) {
            return { message: `${result.rowsAffected} row updated` };
        } else {
            return { message: 'No task found.' };
        }
    });
}


async function resetTables() {
    try {
        const filePath = './utils/initiate.sql';

        // Read SQL file content
        const sqlFileContent = await fs.readFile(filePath, 'utf8');

        // Split SQL file content into individual statements
        const sqlStatements = sqlFileContent.split(';');

        // Execute each SQL statement using the withOracleDB wrapper
        await withOracleDB(async (connection) => {
            for (const sqlStatement of sqlStatements) {
                if (sqlStatement.trim() !== '') {
                    try {
                        await connection.execute(sqlStatement);
                        console.log(`Statement executed: ${sqlStatement}`);
                    } catch (error) {
                        console.error(`Error executing statement: ${sqlStatement}`, error);
                    }
                }
            }
        });

        return true;
    } catch (error) {
        return false;
    }
}


module.exports = {
    testOracleConnection,
    //fetchDemotableFromDb,
    resetTables,
    insertPlotTask,
    getPlots,
    updatePlots,
    getPlotTasksStatus,
    getTableNames,
    projection,
    getTable,
    getTableHeaders,
    selection,
    test,
    getPlotInfo,
    getTasksByPlot,
    getPlotsHavingTasks,
    getBuildingsSupplyCount,
    deletePlotTask,
    division,
};
