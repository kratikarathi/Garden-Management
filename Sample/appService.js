const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};


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

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiatePlotOwnerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PlotOwnerTable`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE PlotOwnerTable (
                SIN CHAR(9),
                PhoneNum CHAR(10),
                PlotID INTEGER ,
                PRIMARY KEY (SIN), 
                FOREIGN KEY (PlotID) REFERENCES Plot (PlotID)
                    ON DELETE CASCADE 
                    ON UPDATE CASCADE, 
                FOREIGN KEY (SIN) REFERENCES CommunityMember(SIN) 
                    ON DELETE CASCADE 
                    ON UPDATE CASCADE 
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateEventTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE EventTable`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE EventTable (
                EventID INTEGER,
                EventDescription VARCHAR (200),
                DT DATE,
                PRIMARY KEY(EventID)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateRequiresTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE RequiresTable`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE RequiresTable (
                TaskNum INTEGER,
                PlotID INTEGER,
                SupplyID INTEGER,
                ToolID INTEGER,
                PRIMARY KEY (TaskNum,PlotID, SupplyID,ToolID),
                FOREIGN KEY (TaskNum) REFERENCES PlotTask(TaskNum) 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (PlotID) REFERENCES Plot(PlotID)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (SupplyID) REFERENCES Supply(SupplyID)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE,
                FOREIGN KEY (ToolID) REFERENCES Tool(ToolID)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateGardenerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE GardernerTable`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE GardenerTable (
               SIN CHAR(9),
               HoursWorked INTEGER
               PRIMARY KEY (SIN),
               FOREIGN KEY (SIN) REFERENCES CommunityMember(SIN)
                   ON DELETE CASCADE
                   ON UPDATE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateCommunityMemberTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE CommunityMemberTable`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE CommunityMemberTable (
                SIN char (9),
                PersonName VARCHAR (50)
                PRIMARY KEY (SIN),
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateBuildingTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE BuildingTable`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE BuildingTable (
                BuildingName VARCHAR (50),
                Capacity INTEGER,
                BuildingLocation VARCHAR (50),
                DoorCode CHAR (4)
                PRIMARY KEY (BuildingName)
            )
        `);
        return true;
    }).catch(() => {
        return false;
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
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable
};