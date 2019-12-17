'use strict';

import express = require('express');
const routerOptions: express.RouterOptions = {
    caseSensitive: true
};
const router: express.Router = express.Router(routerOptions);
const Tasks = require('../models/Tasks');
const TasksHistory = require('../models/TasksHistory');

//----------------------------------------------
//                  GETTERS                    |
//----------------------------------------------

router.get('/:id([0-9]+)?',
    async function (req: any, res: express.Response, next: express.NextFunction) {
    try {
        const result: Promise<any> = req.params.id
            ? await Tasks.getTaskById(req.decoded.userId, req.params.id)
            : await Tasks.getAllUserTasks(req.decoded.userId);
        res.json({success: true, tasks: result});
    } catch (e) {
        next(e);
    }
});

router.get('/history/:id([0-9]+)?',
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

router.post('/', async function (req: any, res: express.Response, next: express.NextFunction) {
    try {
        if (!(req.body && req.body.urgence && req.body.importance && req.body.title
            && req.body.description && req.body.deadline))
            throw { code: 422, message: 'Missing parameters'};
        const datas: {
            id_user: number,
            urgence: number,
            importance: number,
            title: string,
            description: string,
            deadline: Date
        } = {
            ...req.body,
            id_user: req.decoded.userId
        };
        await Tasks.addTasks(datas);
        res.status(201).json({success: true});
    } catch (e) {
        next(e);
    }
});

router.put('/:id([0-9]+)', async function (req: any, res: express.Response, next: express.NextFunction) {
    try {
        if (!(req.body && req.body.urgence && req.body.importance && req.body.title
            && req.body.description && req.body.deadline))
            throw { code: 422, message: 'Missing parameters'};
        await Tasks.updateTasks(req.params.id, req.body);
        res.json({success: true});
    } catch (e) {
        next(e);
    }
});

router.delete('/:id([0-9]+)', async function (req: any, res: express.Response, next: express.NextFunction) {
    try {
        const toDelete: Promise<any> = await Tasks.getTaskById(req.params.id);
        await TasksHistory.addTasksHistory(toDelete);
        await Tasks.deleteTasks(req.params.id);
        res.status(204);
    } catch (e) {
        next(e);
    }
});


export = router;
