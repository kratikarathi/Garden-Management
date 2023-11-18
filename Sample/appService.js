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
        const result = await connection.execute(`SELECT * FROM DEMOTABLE`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function dropAllTables() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DROP TABLE PlotOwnerTable;
             DROP TABLE EventTable;
             DROP TABLE RequiresTable;
             DROP TABLE GardenerTable;
             DROP TABLE CommunityMemberTable;
             DROP TABLE PlotTask;
             DROP TABLE AnimalInstructions;
             DROP TABLE Animal;
             DROP TABLE ToolInfo;
             DROP TABLE Plot;
             DROP TABLE Tool;
             DROP TABLE SupplyInformation;
             DROP TABLE Supply;
             DROP TABLE PlotPrices;
             DROP TABLE Areas;
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateAllTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(dropAllTables());
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
            );
            INSERT INTO PlotOwnerTable (“888789888”, 2368634471, 23) 
            
            CREATE TABLE EventTable (
                EventID INTEGER,
                EventDescription VARCHAR (200),
                DT DATE,
                PRIMARY KEY(EventID)
            )
            INSERT INTO EventTable (100, “Celebrating the Community Garden’s 25th Anniversary”,”7-09-23”)
            
            CREATE TABLE RequiresTable
            (
                TaskNum  INTEGER,
                PlotID   INTEGER,
                SupplyID INTEGER,
                ToolID   INTEGER,
                PRIMARY KEY (TaskNum, PlotID, SupplyID, ToolID),
                FOREIGN KEY (TaskNum) REFERENCES PlotTask (TaskNum)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (PlotID) REFERENCES Plot (PlotID)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (SupplyID) REFERENCES Supply (SupplyID)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE,
                FOREIGN KEY (ToolID) REFERENCES Tool (ToolID)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
            )
            INSERT INTO Requires (12, 83, null, 10)
            
            CREATE TABLE GardenerTable
            (
                SIN         CHAR(9),
                HoursWorked INTEGER
                    PRIMARY KEY (SIN),
                FOREIGN KEY (SIN) REFERENCES CommunityMember (SIN)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
            INSERT INTO Gardener (“475385473”, 0)
            
            CREATE TABLE CommunityMemberTable
            (
                SIN        char(9),
                PersonName VARCHAR(50)
                    PRIMARY KEY (SIN),
            )
            INSERT INTO CommunityMember(“823709808”, “Kratika”)
            
            CREATE TABLE BuildingTable
            (
                BuildingName     VARCHAR(50),
                Capacity         INTEGER,
                BuildingLocation VARCHAR(50),
                DoorCode         CHAR(4)
                    PRIMARY KEY (BuildingName)
            )
            INSERT INTO Building (“Chicken Coop”, 30, “east side of barn”, null)
            
            CREATE TABLE PlotTask
            (
                TaskNum         INTEGER,
                PlotID          INTEGER,
                TaskDescription VARCHAR(200),
                Deadline        DATE,
                SIN             CHAR(9),
                PRIMARY KEY (TaskNum,PlotID),
                FOREIGN KEY (PlotID) REFERENCES Plot (PlotID)
                    ON DELETE CASCADE,
                FOREIGN KEY (SIN) REFERENCES Gardener (SIN)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
            )
            INSERT INTO PlotTask(100,40,” Harvest Fruits”, “25-10-23", “455334346")
            
            CREATE TABLE AnimalInstructions
            (
                Species          VARCHAR(50),
                FeedInstructions VARCHAR(200),
                PRIMARY KEY (Species)
            )
            INSERT INTO AnimalInstructions(“Taby Cat”, “Do not feed, exclusively hunts mice”)
            
            CREATE TABLE Animal
            (
                AnimalName   VARCHAR(20),
                Species      VARCHAR(50),
                BuildingName VARCHAR(200),
                PRIMARY KEY (AnimalName),
                FOREIGN KEY (Species) REFERENCES AnimalInstructions (Species),
                FOREIGN KEY (BuildingName) REFERENCES Building (BuildingName)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
            )
            INSERT INTO Animal (“fatty the fat cat”, “Taby Cat”, “Barn”)
            CREATE TABLE ToolInfo
            (
                Model  VARCHAR(50),
                Make VARCHAR(50),
                ToolDescription VARCHAR(200),
                ToolCost INTEGER,
                PRIMARY KEY (Model, Make)
            )
            INSERT INTO ToolInfo(“Firebolt 500”,” Wizarding Tools”,” Shovel”,50000)
            
            CREATE TABLE Plot
            (
                PlotID    INTEGER,
                Width     INTEGER,
                Height    INTEGER,
                PlantType VARCHAR(50),
                SIN       CHAR(9),
                PRIMARY KEY (PlotID),
                FOREIGN KEY (Width, Height) REFERENCES Areas (Width, Height)
                    ON UPDATE CASCADE,
                FOREIGN KEY (SIN) REFERENCES PlotOwner (SIN)
                    ON UPDATE CASCADE
            )
            INSERT INTO Plot(83, 15, 10, “Tomatoes”, “823709808") 
                
            CREATE TABLE Tool
            (
                ToolID          INTEGER,
                Model           VARCHAR(50),
                Make            VARCHAR(50),
                LastMaintenance DATE,
                BuildingName    VARCHAR(50),
                PRIMARY KEY (ToolID),
                FOREIGN KEY (Model, Make) REFERENCES ToolInfo (Model, Make),
                FOREIGN KEY (BuildingName) REFERENCES BuildingName (BuildingName)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
            INSERT INTO Tool (3, “Firebolt 500”,” Wizarding Tools”,”13-12-2002",”East Shed”)
            
            CREATE TABLE SupplyInformation
            (
                SupplyType   VARCHAR(20),
                SupplyCost   INTEGER,
                Instructions VARCHAR(200),
                PRIMARY KEY (SupplyType)
            )
            INSERT INTO SupplyInformation(“Magic Beans”, 3000, “plant and pray”)
            
            CREATE TABLE Supply
            (
                SupplyID     INTEGER,
                SupplyType   VARCHAR(20),
                BuildingName VARCHAR(50),
                SupplyCount  INTEGER,
                PRIMARY KEY (SupplyID),
                FOREIGN KEY (SupplyType) REFERENCES SupplyInformation (SupplyType),
                FOREIGN KEY (BuildingName) REFERENCES BuildingName (BuildingName)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
            INSERT INTO Supply (1, “Cat Food”, “Barn”, 5)
            
            CREATE Table PlotPrices
            (
                Area        INTEGER,
                RentalPrice INTEGER,
                PRIMARY KEY (Area)
            )
            INSERT INTO PlotPrices(1110, 9000000)
            
            CREATE Table Areas
            (
                Width  INTEGER,
                Height INTEGER,
                Area   INTEGER,
                PRIMARY KEY(Width, Height),
                FOREIGN KEY (Area) REFERENCES PlotPrices(Area)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
            INSERT INTO Areas (23,100,2300)
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