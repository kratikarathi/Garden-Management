DROP TABLE Requires;
DROP TABLE PlotTask;
DROP TABLE Supply;
DROP TABLE Tool;
DROP TABLE Animal;
DROP TABLE Building;
DROP TABLE PlotOwner;
DROP TABLE Gardener;
DROP TABLE Plant;
DROP TABLE Plot;
DROP TABLE PlantInformation;
DROP TABLE CommunityMember;
DROP TABLE AnimalInstructions;
DROP TABLE ToolInfo;
DROP TABLE SupplyInformation;
DROP TABLE Event;
CREATE TABLE Event (
    EventID  NUMBER GENERATED BY DEFAULT AS IDENTITY,
    EventDescription VARCHAR(200),
    DT DATE,
    PRIMARY KEY (EventID)
);
CREATE TABLE SupplyInformation (
    SupplyType VARCHAR(20),
    SupplyCost INTEGER,
    Instructions VARCHAR(200),
    PRIMARY KEY (SupplyType)
);
CREATE TABLE Building (
    BuildingName VARCHAR(50),
    Capacity INTEGER,
    DoorCode CHAR(4),
    Width INTEGER,
    Height INTEGER,
    xCoord INTEGER,
    yCoord INTEGER,
    PRIMARY KEY (BuildingName)
);
CREATE TABLE CommunityMember (
    SIN char(9),
    PersonName VARCHAR(50),
    PRIMARY KEY (SIN)
);
CREATE TABLE PlantInformation (
    PlantName VARCHAR(50),
    Instructions VARCHAR(200),
    PlantType VARCHAR(50),
    GrowthDays INTEGER,
    PRIMARY KEY (PlantName)
);
CREATE TABLE Plot (
    PlotID NUMBER GENERATED BY DEFAULT AS IDENTITY,
    Width INTEGER,
    Height INTEGER,
    xCoord INTEGER,
    yCoord INTEGER,
    PlantName VARCHAR(50),
    SIN CHAR(9),
    Price INTEGER,
    PRIMARY KEY (PlotID),
    FOREIGN KEY (SIN) REFERENCES CommunityMember (SIN),
    FOREIGN KEY (PlantName) REFERENCES PlantInformation (PlantName)
);
CREATE TABLE Plant (
    PlantID NUMBER GENERATED BY DEFAULT AS IDENTITY,
    PlotID INTEGER,
    PlantName VARCHAR(50),
    PlantDate DATE DEFAULT SYSDATE,
    HarvestDate DATE DEFAULT NULL,
    HarvestWeight INTEGER DEFAULT NULL,
    PRIMARY KEY (PlantID),
    FOREIGN KEY (PlotID) REFERENCES Plot (PlotID),
    FOREIGN KEY (PlantName) REFERENCES PlantInformation (PlantName)
);
CREATE TABLE Supply (
    SupplyID NUMBER GENERATED BY DEFAULT AS IDENTITY,
    SupplyType VARCHAR(20),
    BuildingName VARCHAR(50),
    SupplyCount INTEGER,
    PRIMARY KEY (SupplyID),
    FOREIGN KEY (SupplyType) REFERENCES SupplyInformation (SupplyType),
    FOREIGN KEY (BuildingName) REFERENCES Building (BuildingName) ON DELETE CASCADE
);
CREATE TABLE PlotOwner (
    SIN CHAR(9),
    PhoneNum CHAR(10),
    PlotID INTEGER,
    PRIMARY KEY (SIN),
    FOREIGN KEY (PlotID) REFERENCES Plot (PlotID) ON DELETE CASCADE,
    FOREIGN KEY (SIN) REFERENCES CommunityMember (SIN) ON DELETE CASCADE
);
CREATE TABLE Gardener (
    SIN CHAR(9),
    HoursWorked INTEGER,
    PRIMARY KEY (SIN),
    FOREIGN KEY (SIN) REFERENCES CommunityMember (SIN) ON DELETE CASCADE
);
CREATE TABLE PlotTask (
    TaskNum INTEGER,
    PlotID INTEGER,
    TaskDescription VARCHAR(200),
    Deadline DATE,
    SIN CHAR(9),
    Status VARCHAR(20) DEFAULT 'Incomplete',
    PRIMARY KEY (TaskNum, PlotID),
    FOREIGN KEY (PlotID) REFERENCES Plot (PlotID) ON DELETE CASCADE,
    FOREIGN KEY (SIN) REFERENCES Gardener (SIN) ON DELETE
    SET NULL
);
CREATE TABLE Animal (
    AnimalName VARCHAR(20),
    Species VARCHAR(50),
    BuildingName VARCHAR(200),
    PRIMARY KEY (AnimalName),
    FOREIGN KEY (BuildingName) REFERENCES building (BuildingName) ON DELETE
    SET NULL
);
CREATE TABLE Requires (
    TaskNum INTEGER,
    PlotID INTEGER,
    SupplyType VARCHAR(20),
    PRIMARY KEY (TaskNum, PlotID, SupplyType),
    FOREIGN KEY (TaskNum, PlotID) REFERENCES PlotTask (TaskNum, PlotID) ON DELETE CASCADE,
    FOREIGN KEY (SupplyType) REFERENCES SupplyInformation (SupplyType) ON DELETE
    SET NULL
);
INSERT INTO CommunityMember
values ('823709808', 'Kratika');
INSERT INTO CommunityMember
values ('895565895', 'Madeleine');
INSERT INTO CommunityMember
values ('475385473', 'John');
INSERT INTO CommunityMember
values ('818786876', 'Jennifer');
INSERT INTO CommunityMember
values ('564556334', 'Allan');
INSERT INTO CommunityMember
values ('888789888', 'Raghav');
INSERT INTO CommunityMember
values ('887515887', 'Julie');
INSERT INTO CommunityMember
values ('455334346', 'Emily');
INSERT INTO CommunityMember
values ('416578443', 'Will');
INSERT INTO PlantInformation
VALUES (
        'Tomato',
        'Water 1 time per day',
        'Vegetable',
        70
    );
INSERT INTO PlantInformation
VALUES ('Basil', 'Water 2 times per week', 'Herb', 60);
INSERT INTO PlantInformation
VALUES (
        'Lettuce',
        'Water 1 time per day',
        'Vegetable',
        30
    );
INSERT INTO PlantInformation
VALUES (
        'Lavender',
        'Water 1-2 times per week',
        'Flower',
        90
    );
INSERT INTO PlantInformation
VALUES (
        'Cucumber',
        'Water 1 time per day',
        'Vegetable',
        50
    );
INSERT INTO PlantInformation
VALUES ('Chives', 'Water 2 times per week', 'Herb', 30);
INSERT INTO PlantInformation
VALUES (
        'Bell Pepper',
        'Water 1 time per day',
        'Vegetable',
        60
    );
INSERT INTO PlantInformation
VALUES (
        'Strawberry',
        'Water 1 time per day',
        'Fruit',
        90
    );
INSERT INTO PlantInformation
VALUES (
        'Squash',
        'Water 1 time every 2-3 days',
        'Vegetable',
        60
    );
INSERT INTO Plot
values (1, 20, 10, 10, 10, 'Tomato', '823709808', 8000);
INSERT INTO Plot
values (2, 20, 10, 10, 40, 'Basil', '895565895', 8000);
INSERT INTO Plot
values (
        3,
        10,
        20,
        40,
        20,
        'Strawberry',
        '818786876',
        10000
    );
INSERT INTO Plot
values (4, 10, 20, 60, 20, 'Squash', '887515887', 5000);
INSERT INTO Plot
values (5, 10, 20, 70, 20, 'Chives', '888789888', 12000);
INSERT INTO Plot
values (6, 10, 20, 70, 20, NULL, NULL, 16000);
INSERT INTO PlotOwner
values ('888789888', '2368634471', 5);
INSERT INTO PlotOwner
values ('887515887', '2366744768', 4);
INSERT INTO PlotOwner
values ('895565895', '6045698761', 2);
INSERT INTO PlotOwner
values ('818786876', '2368634471', 3);
INSERT INTO PlotOwner
values ('823709808', '2368634471', 1);
INSERT INTO Gardener
values ('475385473', 0);
INSERT INTO Gardener
values ('564556334', 13);
INSERT INTO Gardener
values ('455334346', 13);
INSERT INTO Gardener
values ('818786876', 30);
INSERT INTO Gardener
values ('823709808', 25);
INSERT INTO PlotTask
values (
        1,
        1,
        'Water',
        TO_DATE('20-10-23', 'DD-MM-YY'),
        '475385473',
        'Complete'
    );
INSERT INTO PlotTask
values (
        1,
        2,
        'Plant',
        TO_DATE('19-10-23', 'DD-MM-YY'),
        '823709808',
        'Complete'
    );
INSERT INTO PlotTask
values (
        1,
        3,
        'Harvest',
        TO_DATE('19-10-23', 'DD-MM-YY'),
        '455334346',
        'Complete'
    );
INSERT INTO PlotTask
values (
        2,
        1,
        'Harvest',
        TO_DATE('25-10-23', 'DD-MM-YY'),
        '455334346',
        'Complete'
    );
INSERT INTO PlotTask
values (
        3,
        1,
        'Weed',
        TO_DATE('01-11-23', 'DD-MM-YY'),
        '455334346',
        'Complete'
    );




INSERT INTO Building
values ('Chicken Coop', 20, NULL, 10, 10, 10, 10);
INSERT INTO Building
values ('Gazebo', 4, NULL, 3, 3, 47, 47);
INSERT INTO Building
values (
        'Barn',
        100,
        '3759',
        10,
        25,
        30,
        0
    );
INSERT INTO Building
values (
        'East Shed',
        50,
        '2744',
        30,
        25,
        0,
        50
    );
INSERT INTO Building
values (
        'West Shed',
        50,
        '3644',
        30,
        25,
        75,
        50
    );
INSERT INTO Animal
values ('Fatty', 'Taby Cat', 'Barn');
INSERT INTO Animal
values ('Nightmare', 'Black Cat', null);
INSERT INTO Animal
values ('Rufus', 'Dog', 'Barn');
INSERT INTO Animal
values ('Zoe', 'Dog', 'Barn');
INSERT INTO Animal
values ('Princess Peck', 'Chicken', 'Chicken Coop');
INSERT INTO SupplyInformation
VALUES ('Seeds', 850, 'Store in a cool, dry place');
INSERT INTO SupplyInformation
VALUES (
        'Fertilizer',
        1499,
        'Follow instructions on the package'
    );
INSERT INTO SupplyInformation
VALUES ('Gloves', 699, 'Keeps your hands clean!');
INSERT INTO SupplyInformation
VALUES (
        'Watering Can',
        2499,
        'Check for leaks and clean regularly'
    );
INSERT INTO SupplyInformation
VALUES (
        'Paddle Hoe',
        11699,
        'Use a broad, fluid sweeping motion to slice weeds.  Clean after use'
    );
INSERT INTO SupplyInformation
VALUES (
        'Dutch Hoe',
        18999,
        'Draw the tip of the hoe handle down the row to create a shallow furrow for shallow-planted seeds.  Clean after use'
    );
INSERT INTO SupplyInformation
VALUES (
        'Shears',
        1799,
        'Use to cut and shape plants.  Careful not to cut any fingers!'
    );
INSERT INTO SupplyInformation
VALUES (
        'Chicken Feed',
        2499,
        'Put 1 scoop of feed per chicken per day in the feeder.'
    );
INSERT INTO Supply
VALUES (1, 'Seeds', 'Barn', 10);
INSERT INTO Supply
VALUES (2, 'Fertilizer', 'Barn', 17);
INSERT INTO Supply
VALUES (3, 'Gloves', 'East Shed', 15);
INSERT INTO Supply
VALUES (4, 'Watering Can', 'East Shed', 4);
INSERT INTO Supply
VALUES (5, 'Paddle Hoe', 'West Shed', 1);
INSERT INTO Supply
VALUES (6, 'Dutch Hoe', 'West Shed', 1);
INSERT INTO Supply
VALUES (7, 'Chicken Feed', 'Chicken Coop', 18);
INSERT INTO Supply
VALUES (8, 'Shears', 'East Shed', 2);
INSERT INTO Supply
VALUES (9, 'Seeds', 'West Shed', 12);
INSERT INTO Supply
VALUES (10, 'Dutch Hoe', 'Barn', 2);

INSERT INTO Event
values (
        5,
        'Celebrating the Community Gardens 25th Anniversary',
        TO_DATE('7-09-23', 'DD-MM-YY')
    );
INSERT INTO Event
values (
        1,
        'Ribbon Cutting at the Community Garden',
        TO_DATE('7-09-89', 'DD-MM-YY')
    );
INSERT INTO Event
values (
        2,
        'Opening of the Barn Building',
        TO_DATE('01-01-2016', 'DD-MM-YY')
    );
INSERT INTO Event
values (
        4,
        'Tommys 7th Birthday Party',
        TO_DATE('23-04-2020', 'DD-MM-YY')
    );
INSERT INTO Event
values (
        3,
        'Farming Workshop for Beginners',
        TO_DATE('05-11-2006', 'DD-MM-YY')
    );
INSERT INTO Requires
values (1, 1, 'Watering Can');
INSERT INTO Requires
values (1, 2, 'Fertilizer');
INSERT INTO Requires
values (1, 2, 'Watering Can');
INSERT INTO Requires
values (1, 2, 'Dutch Hoe');
INSERT INTO Requires
values (1, 3, 'Shears');
INSERT INTO Requires
values (1, 3, 'Gloves');
INSERT INTO Requires
values (2, 1, 'Gloves');
INSERT INTO Requires
values (2, 1, 'Paddle Hoe');
INSERT INTO Requires
values (2, 1, 'Shears');
commit;