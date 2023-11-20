DROP TABLE Requires;
DROP TABLE PlotTask;
DROP TABLE Supply;
DROP TABLE Tool;
DROP TABLE Animal;
DROP TABLE Building;
DROP TABLE PlotOwner;
DROP TABLE Gardener;
DROP TABLE Plot;
DROP TABLE Areas;
DROP TABLE CommunityMember;
DROP TABLE AnimalInstructions;
DROP TABLE ToolInfo;
DROP TABLE SupplyInformation;
DROP TABLE PlotPrices;
DROP TABLE Event;

CREATE TABLE Event (
    EventID INTEGER,
    EventDescription VARCHAR(200),
    DT DATE,
    PRIMARY KEY (EventID)
);

CREATE TABLE ToolInfo (
    Model VARCHAR(50),
    Make VARCHAR(50),
    ToolDescription VARCHAR(200),
    ToolCost INTEGER,
    PRIMARY KEY (Model, Make)
);

CREATE TABLE SupplyInformation (
    SupplyType VARCHAR(20),
    SupplyCost INTEGER,
    Instructions VARCHAR(200),
    PRIMARY KEY (SupplyType)
);

CREATE TABLE AnimalInstructions (
    Species VARCHAR(50),
    FeedInstructions VARCHAR(200),
    PRIMARY KEY (Species)
);

CREATE TABLE Building (
    BuildingName VARCHAR(50),
    Capacity INTEGER,
    BuildingLocation VARCHAR(50),
    DoorCode CHAR(4),
    PRIMARY KEY (BuildingName)
);

CREATE TABLE PlotPrices (
    Area INTEGER,
    RentalPrice INTEGER,
    PRIMARY KEY (Area)
);

CREATE TABLE CommunityMember (
    SIN char(9),
    PersonName VARCHAR(50),
    PRIMARY KEY (SIN)
);

CREATE TABLE Areas (
    Width INTEGER,
    Height INTEGER,
    Area INTEGER,
    PRIMARY KEY(Width, Height),
    FOREIGN KEY (Area) REFERENCES PlotPrices(Area) ON DELETE CASCADE
);

CREATE TABLE Plot (
    PlotID INTEGER,
    Width INTEGER,
    Height INTEGER,
    PlantType VARCHAR(50),
    SIN CHAR(9),
    PRIMARY KEY (PlotID),
    FOREIGN KEY (Width, Height) REFERENCES Areas (Width, Height),
    FOREIGN KEY (SIN) REFERENCES CommunityMember (SIN)
);

CREATE TABLE Tool (
    ToolID INTEGER,
    Model VARCHAR(50),
    Make VARCHAR(50),
    LastMaintenance DATE,
    BuildingName VARCHAR(50),
    PRIMARY KEY (ToolID),
    FOREIGN KEY (Model, Make) REFERENCES ToolInfo (Model, Make),
    FOREIGN KEY (BuildingName) REFERENCES building (BuildingName) ON DELETE CASCADE
);

CREATE TABLE Supply (
    SupplyID INTEGER,
    SupplyType VARCHAR(20),
    BuildingName VARCHAR(50),
    SupplyCount INTEGER,
    PRIMARY KEY (SupplyID),
    FOREIGN KEY (SupplyType) REFERENCES SupplyInformation (SupplyType),
    FOREIGN KEY (BuildingName) REFERENCES building (BuildingName) ON DELETE CASCADE
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
    PRIMARY KEY (TaskNum, PlotID),
    FOREIGN KEY (PlotID) REFERENCES Plot (PlotID) ON DELETE CASCADE,
    FOREIGN KEY (SIN) REFERENCES Gardener (SIN) ON DELETE SET NULL
);

CREATE TABLE Animal (
    AnimalName VARCHAR(20),
    Species VARCHAR(50),
    BuildingName VARCHAR(200),
    PRIMARY KEY (AnimalName),
    FOREIGN KEY (Species) REFERENCES AnimalInstructions (Species),
    FOREIGN KEY (BuildingName) REFERENCES building (BuildingName) ON DELETE SET NULL
);

CREATE TABLE Requires (
    TaskNum INTEGER,
    PlotID INTEGER,
    SupplyID INTEGER,
    ToolID INTEGER,
    PRIMARY KEY (TaskNum, PlotID, SupplyID, ToolID),
    FOREIGN KEY (TaskNum,PlotID) REFERENCES PlotTask (TaskNum,PlotID) ON DELETE CASCADE,
    FOREIGN KEY (SupplyID) REFERENCES Supply (SupplyID) ON DELETE SET NULL,
    FOREIGN KEY (ToolID) REFERENCES Tool (ToolID) ON DELETE SET NULL
);

INSERT INTO PlotOwner
values ('888789888', 2368634471, 23);
INSERT INTO PlotOwner
values ('887515887', 2366744768, 40);
INSERT INTO PlotOwner
values ('895565895', 6045698761, 10);
INSERT INTO PlotOwner
values ('818786876', 2368634471, 55);
INSERT INTO PlotOwner
values ('823709808', 2368634471, 83);
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
INSERT INTO Gardener
values ('475385473', 0);
INSERT INTO Gardener
values ('564556334', 13);
INSERT INTO Gardener
values ('455334346', 13);
INSERT INTO Gardener
values ('81886876', 30);
INSERT INTO Gardener
values ('82370908', 25);
INSERT INTO PlotTask
values (
        12,
        83,
        'Water all the Tomato Plants',
        '20-10-23',
        '475385473'
    );
INSERT INTO PlotTask
values (
        1,
        10,
        'Remove all Weeds',
        '19-10-23',
        '823709808'
    );
INSERT INTO PlotTask
values (
        55,
        55,
        'Harvest Fruits',
        '19-10-23',
        '455334346'
    );
INSERT INTO PlotTask
values (
        100,
        40,
        'Harvest Fruits',
        '25-10-23',
        '455334346'
    );
INSERT INTO PlotTask
values (58, 55, 'Replant Seeds', '01-11-23', '455334346');
INSERT INTO AnimalInstructions
values (
        'Taby Cat',
        'Do not feed, exclusively hunts mice'
    );
INSERT INTO AnimalInstructions
values ('Black Cat', 'cat food in barn, one scoop');
INSERT INTO AnimalInstructions
values ('Squirrel', 'Do not give squirrels bird feed');
INSERT INTO AnimalInstructions
values ('Bird', 'bird feed on top right corner of shed');
INSERT INTO AnimalInstructions
values (
        'Dog',
        'dogs can have scrap produce from compost bin'
    );
INSERT INTO AnimalInstructions
values (
        'Chicken',
        'fill chicken feed tray with chicken feed every morning'
    );
INSERT INTO Animal
values ('fatty the fat cat', 'Taby Cat', 'Barn');
INSERT INTO Animal
values ('nightmare', 'Black Cat', null);
INSERT INTO Animal
values ('Rufus', 'Dog', 'Barn');
INSERT INTO Animal
values ('Zoe', 'Dog', 'Barn');
INSERT INTO Animal
values ('Princess Peck', 'Chicken', 'Chicken Coop');
INSERT INTO Supply
values (1, 'Cat Food', 'Barn', 5);
INSERT INTO Supply
values (2, 'Tomato Seed Pack', 'East Shed', 15);
INSERT INTO Supply
values (3, 'Magic Bean Sprouts', 'East Shed', 2);
INSERT INTO Supply
values (4, 'Fertilizer bag', 'West Shed', 10);
INSERT INTO Supply
values (5, 'Watering Can', 'Gazebo', 2);
INSERT INTO SupplyInformation
values (
        'Tomato Seed Pack',
        200,
        'Plant handful in fertilizer, water once per day'
    );
INSERT INTO SupplyInformation
values ('Magic Beans', 3000, 'plant and pray');
INSERT INTO SupplyInformation
values ('Cat Food', 5000, null);
INSERT INTO SupplyInformation
values (
        'Fertilizer bag',
        2000,
        'Add to new plot before planting'
    );
INSERT INTO SupplyInformation
values (
        'Watering Can',
        1000,
        'Water plants according to watering instructions'
    );
INSERT INTO Building
values ('Chicken Coop', 30, 'east side of barn', null);
INSERT INTO Building
values (
        'Gazebo',
        50,
        'middle of the community garden',
        null
    );
INSERT INTO Building
values (
        'Barn',
        45,
        'northmost end of community garden',
        '3759'
    );
INSERT INTO Building
values (
        'East Shed',
        60,
        'east end of the garden',
        '2744'
    );
INSERT INTO Building
values (
        'West Shed',
        60,
        'west end of the garden',
        '3664'
    );
INSERT INTO ToolInfo
values (
        'Firebolt 500',
        'Wizarding Tools',
        'Shovel',
        50000
    );
INSERT INTO ToolInfo
values ('Nimbus 2000', 'Wizarding Tools', 'Axe', 100000);
INSERT INTO ToolInfo
values (
        'Golden Snitch',
        'Grindlock’s Farming World',
        'Plough',
        250000
    );
INSERT INTO ToolInfo
values (
        'Zeus Power',
        'Pete’s Farming Tool',
        'Rake',
        150000
    );
INSERT INTO ToolInfo
values (
        'Poseidon Water Hose',
        'Greek Farming Supplies',
        'Hose',
        5100000
    )
INSERT INTO Tool
values (
        3,
        'Firebolt 500',
        'Wizarding Tools',
        '13-12-2002',
        'East Shed'
    );
INSERT INTO Tool
values (
        10,
        'Poseidon Water Hose',
        'Greek Farming Supplies',
        '16-06-2012',
        'East Shed'
    );
INSERT INTO Tool
values (
        50,
        'Zeus Power',
        'Petes Farming Tool',
        '13-01-2020',
        'West Shed'
    );
INSERT INTO Tool
values (
        100,
        'Golden Snitch',
        'Grindlock’s Farming World',
        '13-10-2023',
        'West Shed'
    );
INSERT INTO Tool
values (
        76,
        'Nimbus 2000',
        'Wizarding Tools',
        '19-05-2018',
        'West Shed'
    );
INSERT INTO PlotPrices
values (2300, 98000000);
INSERT INTO PlotPrices
values (150, 100000);
INSERT INTO PlotPrices
values (2300, 98000000);
INSERT INTO PlotPrices
values (1500, 1000000);
INSERT INTO PlotPrices
values (1110, 9000000);
INSERT INTO Areas
values (23, 100, 2300);
INSERT INTO Areas
values (15, 10, 150);
INSERT INTO Areas
values (111, 10, 1110);
INSERT INTO Areas
values (15, 100, 1500);
INSERT INTO Areas
values (23, 100, 2300);
INSERT INTO Requires
values (12, 83, null, 10);
INSERT INTO Requires
values (1, 10, null, 50);
INSERT INTO Requires
values (58, 55, 2, 100);
INSERT INTO Requires
values (58, 55, 2, 50);
INSERT INTO Requires
values (58, 55, null, 3);
INSERT INTO Plot
values (83, 15, 10, 'Tomatoes', '823709808');
INSERT INTO Plot
values (10, 111, 10, 'Tomatoes', '895565895');
INSERT INTO Plot
values (55, 23, 100, 'Strawberries', '818786876');
INSERT INTO Plot
values (40, 15, 100, 'Tomatoes', '887515887');
INSERT INTO Plot
values (23, 23, 100, 'Magic Beans', '888789888');
INSERT INTO Event
values (
        100,
        'Celebrating the Community Gardens 25th Anniversary',
        '7-09-23'
    );
INSERT INTO Event
values (
        1,
        'Ribbon Cutting at the Community Garden',
        '7-09-89'
    );
INSERT INTO Event
values (25, 'Opening of the Barn Building', '01-01-2016');
INSERT INTO Event
values (65, 'Tommys 7th Birthday Party', '23-04-2020');
INSERT INTO Event
values (
        12,
        'Farming Workshop for Beginners',
        '05-11-2006'
    );