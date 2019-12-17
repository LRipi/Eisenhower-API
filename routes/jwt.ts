import express = require('express');
import jwt = require('jsonwebtoken');

if (process.env.DEBUG === 'true')
    console.log('[\x1b[31mINFO\x1b[0m] Json Web Token : \x1b[32mOK\x1b[0m');

export = function checkToken(req: any, res: express.Response, next: express.NextFunction): any {
    const token: string = req.body.token || req.params.token || req.headers['x-access-token'];
    if (token)
        // @ts-ignore
        jwt.verify(token, process.env.JWT_KEY,
            function(err: jwt.JsonWebTokenError | jwt.TokenExpiredError, decoded: any) {
            if (err)
                return err.name === 'TokenExpiredError' ?
                    res.status(403).json({ success: false, message: 'Token expired.' }) :
                    res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
            else {
                req.decoded = decoded;
                next();
            }
        });
    else
        return res.status(403).send({success: false, message: 'No token provided.'});
};
