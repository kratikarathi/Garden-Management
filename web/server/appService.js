const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('../.env');
//oracledb.initOracleClient({libDir: "/Users/madpenner/oracle/instantclient/instantclient_19_8"});
// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};

// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
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


async function getTableNames() {
    console.log("Getting list of all Tables");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT table_name FROM user_tables
        `
        );
        return result;
    }).catch(() => {
        return false;
    });
}

async function getTable(tableName) {
    const query = `SELECT * FROM ${tableName}`
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result;
    }).catch(() => {
        return false;
    });
}

async function getTableHeaders(tableName) {
    const query = `SELECT COLUMN_NAME FROM ALL_TAB_COLUMNS
                WHERE TABLE_NAME = '${tableName}'`
                console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result;
    }).catch(() => {
        return false;
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
    }).catch(() => {
        return false;
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
    }).catch(() => {
        return false;
    });
}

// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
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
    }).catch(() => {
        return false;
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
    }).catch(() => {
        return false;
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
    }).catch(() => {
        return false;
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

/*async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE ( 
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}*/

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
    getTableHeaders
    //insertDemotable,
    //updateNameDemotable,
    //countDemotable
};
