const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    try {
        const isConnect = await appService.testOracleConnection();
        if (isConnect) {
            res.json({connected:true});
        } else {
            res.json({connected:false});
        }
    } catch(e){
        res.status(500).json({connected:false,error: e.message});
    }
   
});

router.post('/get-plot-info',async(req,res) => {
    const {plotID} = req.body;
    try {
        const result = await appService.getPlotInfo(plotID);
        res.json({data: result});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.post('/delete-plot-task',async(req,res) => {
    const {PlotID, TaskNum} = req.body;
    try {
        const result = await appService.deletePlotTask(TaskNum,PlotID);
        res.json({data: result});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.post('/insert-plot-task',async(req,res) => {
    const {PlotID, TaskDescription, Deadline, SIN} = req.body;
    try {
        const result = await appService.insertPlotTask(PlotID, TaskDescription, Deadline, SIN);
        res.json({data: result});
    } catch(e) {
        res.status(500).json({error: e.message});
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

router.get('/division', async (req, res) => {
    try {
        const result = await appService.division();
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

router.post('/get-headers',async (req, res) => {
    const {tableName} = req.body;
    try {
        const tableHeaders = await appService.getTableHeaders(tableName);
        res.json({ headers: tableHeaders.rows });
    } catch(e) {
        res.status(500).json({error: e.message});
    }

});

//provide tableName:and headers: and returns the table data projected onto those
router.post('/projection',async (req, res) => {
    const {tableName,headers} = req.body;
    try {
        const projectedTable = await appService.projection(tableName,headers);
        res.json({ data: projectedTable });
    } catch(e) {
        res.status(500).json({error: e.message});
    }

});

router.post('/selection',async (req, res) => {
    const {tableName,conditions} = req.body;
    console.log(tableName,conditions);
    try {
        const selectedTable = await appService.selection(tableName,conditions);
        res.json({ data: selectedTable });
    } catch(e) {
        res.status(500).json({error: e.message});
    }

});

router.post('/get-table', async (req, res) => {
    const {tableName} = req.body;
    try {
        const table = await appService.getTable(tableName);
        res.json({ data: table });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.get('/get-table-names', async (req, res) => {
 
    try {
        const tableNames = await appService.getTableNames();
        res.json({ data: tableNames });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

router.post('/test', async (req, res) => {
    const {query} = req.body;
    try {
        const data = await appService.test(query);
        res.json({ data: data });
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


module.exports = router;