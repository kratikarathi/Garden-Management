const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.json({connected:true});
    } else {
        res.json({connected:false});
    }
});

router.post('/update-plots', async (req, res) => {
    const {oldNum, oldID, desc, date, sin, stat} = req.body;
    console.log("Updating plot tasks router" + oldID + sin + stat);
    console.log(req.body);
    const updateResult = await appService.updatePlots(oldNum, oldID, desc, date, sin, stat);
    if (updateResult) {
        // res.json({ success: true });
        res.send('them plots be updated.');
    } else {
        // res.status(500).json({ success: false });
        res.status(500).send('not today dawg');
    }
});

router.get('/get-plot-tasks', async (req, res) => {
    try {
        const result = await appService.getPlotTasksStatus();
        res.json({data: result});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.get('/get-tasks-by-plot', async (req, res) => {
    // const {plotID} = req.params;
    try {
        const result = await appService.getTasksByPlot();
        res.json({data: result});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.get('/get-plots-having-tasks', async (req, res) => {
    try {
        const result = await appService.getPlotsHavingTasks();
        res.json({data: result});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.get('/get-buildings-supply-count', async (req, res) => {
    try {
        const result = await appService.getBuildingsSupplyCount();
        res.json({data: result});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.get('/get-plots', async (req, res) => {
    try {
         const result = await appService.getPlots();
         res.json({data: result});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.get('/reset-tables', async (req, res) => {
    const result = await appService.resetTables();
   
    if(result) {
        res.send('Tables successfully reset.');
    }else {
        res.status(500).send('Failed to reset tables.');
    }
});

router.get('/insert-member', async (req, res) => {
    const result = await appService.resetTables();
   
    if(result) {
        res.send('Tables successfully reset.');
    }else {
        res.status(500).send('Failed to reset tables.');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-tables", async (req, res) => {
    const initiateResult = await appService.initiateTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});


module.exports = router;