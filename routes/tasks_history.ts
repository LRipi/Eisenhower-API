'use strict';

import express = require('express');
const routerOptions: express.RouterOptions = {
    caseSensitive: true
};
const router: express.Router = express.Router(routerOptions);
const TasksHistory = require('../models/TasksHistory');

//----------------------------------------------
//                  GETTERS                    |
//----------------------------------------------

router.get('/',
    async function (req: any, res: express.Response, next: express.NextFunction) {
        try {
            const result: Promise<any> = req.params.id
                ? await TasksHistory.getTaskById(req.decoded.userId, req.params.id)
                : await TasksHistory.getAllUserTasks(req.decoded.userId);
            res.json({success: true, tasks: result});
        } catch (e) {
            next(e);
        }
    });

//----------------------------------------------
//                  SETTERS                    |
//----------------------------------------------

router.post('/', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

    } catch (e) {
        next(e);
    }
});

router.put('/', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

    } catch (e) {
        next(e);
    }
});

router.delete('/', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

    } catch (e) {
        next(e);
    }
});


export = router;
