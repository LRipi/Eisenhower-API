import * as express from "express";

import usersRouter = require('./users');
import tasksRouter = require('./tasks');

import path = require('path');
const config = require(path.resolve('server'));
import ip = require('ip');
import fs = require('fs');
import jwtCheck = require('./jwt');

// Swagger to make docs
import swaggerUiExpress from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocs = YAML.load(path.join(__dirname, '../swagger.yaml'));
const swaggerOptions: {
    customCss: any,
    explorer: boolean,
    swaggerOptions: {
        docExpansion: string
    }
} = {
    explorer: true,
    swaggerOptions: {
        docExpansion: 'none'
    },
    customCss: fs.readFileSync(path.join(__dirname, '../public/theme-swagger.css'))
};

export = function (app: express.Application) {
    // Create route for the documentation
    app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs, swaggerOptions));
    app.use('/users', usersRouter);

    app.get('/about.json', function (req: express.Request, res: express.Response) {
        const d: number = Date.now();
        config.server.current_time = Math.floor( d / 1000);
        config.client.host = ip.address();
        res.json(config);
    });

    app.get('/', function (req: express.Request, res: express.Response) {
        res.send('API is alive ! (TEST5)');
    });

    app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
        jwtCheck(req, res, next);
    });

    app.use('/tasks', tasksRouter);

    // catch 404 and forward to error handler
    app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
        next({ code: 404, message: 'Route not found.' });
    });

    // error handling
    app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            switch (err.errno) {
                case 1062:
                    res.status(409).json({success:false, message: "Duplicate entry"});
                    break;
                case 1048:
                    res.status(422).json({success:false, message: "Missing field in request or invalid data."});
                    break;
                default:
                    res.status(err.code ? err.code : 500).json({
                        success: false,
                        message: err.message ? err.message : "Something went wrong"
                    });
            }
        } catch (e) {
            return res.status(500).json({
                success : false,
                message : "Unknown server error."
            });
        }
    });
};
