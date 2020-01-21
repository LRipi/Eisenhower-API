import express = require('express');
const routerOptions: express.RouterOptions = {
  caseSensitive: true
};
const router: express.Router = express.Router(routerOptions);
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
const generator = require('generate-password');
const gmail = require('../models/Gmail');

const User = require('../models/Users');
const jwtCheck = require('./jwt');

//----------------------------------------------
//                  SETTERS                    |
//----------------------------------------------

/**
 * Route to sign up
 */
router.post('/create',
    async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        if (!(req.body && req.body.name && req.body.login && req.body.password))
            throw {code: 422, message: "Missing parameters."};
        await User.createUser(req.body);
        res.status(201).json({success:true});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

/**
 * Route to sign in
 */
router.post('/login',
    async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
    	console.log(req.body);
        if (!req.body.login || !req.body.password)
            throw { code: 422, message: 'Missing parameter in body field' };
        const user: any = await User.getUserByLogin(req.body.login);
        if (!user.length)
                throw {code: 401, message: 'Authentication failed.'};
        if (user[0].verified === 0)
            throw {code: 401, message: 'You email hasn\'t been confirmed.'};
        let isAdmin = false;
        const result: Boolean = bcrypt.compareSync(req.body.password, user[0].password);
        if (!result)
            throw {code: 401, message: 'Authentication failed.'};
        const payload = {
            isAdmin: isAdmin,
            userId: user[0].id
        };
        user[0].token = jwt.sign(payload, '2lfAtoo9hG', {expiresIn: 86400});
        user[0].tokenExpires = 86400;
        delete user[0]["password"];
        res.json({success: true, user: user[0]});
    } catch (e) {
        next(e);
    }
});

/**
 * Route to get your password by mail if you forget it
 */
router.post('/forgotten',
    async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        if (!req.body.login)
            throw {code: 422, message: 'Missing parameters.'};
        const user = await User.getUserByLogin(req.body.login);
        if (!user.length)
            throw {code: 404, message: 'This account doesn\'t exist.'};
        const password: string = generator.generate({
            length: 10,
            numbers: true,
            symbols: true,
            strict: true
        });
        const Gmail = new gmail(user[0].login);
        const informations: {
            login: string,
            name: string,
            password: string
        } = {
            login: user[0].login,
            name: user[0].name,
            password: password
        };
        const hash = await User.modifyUserById(user[0].id, informations);
        Gmail.sendRecuperationPassword(`http://localhost:3002/?passwordRecover=${user[0].id}-${hash}`);
        res.json({success: true});
    } catch (e) {
        next(e);
    }
});

/**
 * Route to update the password
 * Can be used after recover the password by e-mail
 */
router.patch('/password', async function (req: any, res: express.Response, next: express.NextFunction) {
    try {
        if (req.body.password === undefined)
            throw {code: 422, message: "Missing parameters."};
        await User.updatePassword(req.body.userId, req.body.password);
        res.json({ success: true });
    } catch (e) {
        next(e);
    }
});

/**
 * All the next routes need to be protected.
 * We set JWT's protection.
 */
router.use(async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    await jwtCheck(req, res, next);
});

/**
 * Route to modify an user
 */
router.put('/', async function (req: any, res: express.Response, next: express.NextFunction) {
    try {
        if (!(req.body && req.body.name && req.body.login && req.body.password))
            throw {code: 422, message: "Missing parameters."};
        await User.modifyUserById(req.decoded.userId, req.body);
        res.json({success:true});
    } catch (e) {
        next(e);
    }
});

/**
 * Route to remove an account
 */
router.delete('/', async function(req: any, res: express.Response, next: express.NextFunction) {
    try {
        await User.deleteUserById(req.decoded.userId);
        res.status(204).json({success:true});
    } catch (e) {
        next(e);
    }
});


//----------------------------------------------
//                  GETTERS                    |
//----------------------------------------------

/**
 * route to get all users and their rights id
 */
router.get('/', async function(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const result: Promise<any> = await User.getAllUser();
        res.json({success: true, users: result});
    } catch (e) {
        next(e);
    }
});

/**
 * Get the user's information
 */
router.get('/me', async function (req: any, res: express.Response, next: express.NextFunction) {
    try {
        let result: Promise<any> = await User.getUserById(req.decoded.userId);
        res.json({success: true, user: result});
    } catch (e) {
        next(e);
    }
});

if (process.env.DEBUG === 'true')
    console.log('[\x1b[31mINFO\x1b[0m] Users routes : \x1b[32mOK\x1b[0m');

export = router;
