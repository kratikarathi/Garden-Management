const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const PORT = process.env.REACT_APP_API_PORT;
const envVariables = loadEnvFile('../.env');
//oracledb.initOracleClient({libDir: "/Users/madpenner/oracle/instantclient/instantclient_19_8"});
// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};
const express = require('express');
const app = express();

// ----------------------------------------------------------
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

async function initiateTables() {
    try {
        const filePath = 'web/server/utils/initiate.sql';

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

        console.log('SQL statements executed successfully.');
    } catch (error) {
        console.error('Error executing SQL statements:', error);
    }
}
app.get('/executeSqlStatements', async (req, res) => {
    await initiateTables();
    res.send('SQL statements executed successfully.');
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});


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
    initiateTables,
    //insertDemotable,
    //updateNameDemotable,
    //countDemotable
};
