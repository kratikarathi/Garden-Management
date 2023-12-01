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
    console.log(columns);
    const query = `SELECT ${columns.map(column => {return (column)})} FROM ${tableName}`
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
    where ${conditions.map((condition) => {return condition.column + condition.operation + condition.value}).join(' AND ')}`
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
    const result = await connection.execute(`
    INSERT INTO CommunityMember
    VALUES (` + Sin + `,` + Name + `,` + Email + `)`
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
        SELECT TaskNum, Status From PlotTask
        `
        );
        return result;
    });
}

async function updatePlots(oldStatus, newStatus) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PlotTask SET status=:newStatus where status=:oldStatus`,
            [newStatus, oldStatus],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
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
    getPlots,
    updatePlots,
    getPlotTasksStatus,
    getTableNames,
    projection,
    getTable,
    getTableHeaders,
    selection,
    test
    //insertDemotable,
    //updateNameDemotable,
    //countDemotable
};
