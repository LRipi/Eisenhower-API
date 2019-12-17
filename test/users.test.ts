'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const config = require('../user')
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const connection = require('../app');
import express = require('express');

describe('[USERS]', function(): void {
    before('Retrieve token', async function(): Promise<void> {
        const res: any = await chai.request(connection).post('/users/login')
            .set({'Content-Type': 'application/json'})
            .send({'login': config.login, 'password': config.password});
        expect(res).to.exist;
        expect(res).to.have.status(200);

        //Check body params
        expect(res.body).to.contain.key("success", "user");
        expect(res.body.user).to.contain.key("id", "login", "name", "token", "tokenExpires", "id_roles", "location", "verified");
        expect(res.body.success).to.be.equal(true);
        //Write token for other tests
        if (res.body.user !== undefined && res.body.user.token !== undefined) {
            headers["x-access-token"] = res.body.user.token;
            config.token = res.body.user.token;
            fs.unlinkSync(path.join(__dirname, '../user.json'));
            fs.writeFileSync(path.join(__dirname, '../user.json'), JSON.stringify(config));
        }
    });
    const headers = {
        'Content-Type': config["Content-Type"],
        "x-access-token": config.token
    };

    let body = {};

    it('POST -> Create user with missing parameter', function(done): void {
        body = {
            "name": "unittest",
            "password": "testunit"
        };
        chai.request(connection).post('/users/create')
            .set(headers)
            .send(body)
            .end(function (req: express.Request, res: express.Request): void {
                expect(res).to.exist;
                expect(res).to.have.status(422);
                expect(res.body).to.contain.key("success", "message");
                expect(res.body.success).to.be.equal(false);
                expect(res.body.message).to.contain("Missing parameters.");
                done();
            });
    });

    it('PUT -> Modify user', function(done): void {
        body = {
            "name": "leo",
            "login": "leo.riberon-piatyszek@epitech.eu",
            "password": "Vtqlf&wD"
        };
        chai.request(connection).put('/users/')
            .set(headers)
            .send(body)
            .end(function (req: express.Request, res: express.Request): void {
                expect(res).to.exist;
                expect(res).to.have.status(200);
                expect(res.body).to.contain.key("success");
                expect(res.body.success).to.be.equal(true);
                done();
            });
    });

    it('PUT -> Modify user with missing parameter', function(done): void {
        body = {
            "name": "unittest",
            "password": "testunit"
        };
        chai.request(connection).put('/users/')
            .set(headers)
            .send(body)
            .end(function (req: express.Request, res: express.Request): void {
                expect(res).to.exist;
                expect(res).to.have.status(422);
                expect(res.body).to.contain.key("success", "message");
                expect(res.body.success).to.be.equal(false);
                expect(res.body.message).to.contain("Missing parameters.");
                done();
            });
    });

    it('GET -> Get user logged info', function(done): void {
        chai.request(connection).get('/users/me')
            .set(headers)
            .end(function (req: express.Request, res: express.Request): void {
                expect(res).to.exist;
                expect(res).to.have.status(200);
                expect(res.body).to.contain.key("success", "user");
                expect(res.body.success).to.be.equal(true);
                expect(res.body.user[0]).to.contain.key("id", "name", "id_roles", "login");
                done();
            });
    });

    it('GET -> Get all users', function(done): void {
        chai.request(connection).get('/users/')
            .set(headers)
            .end(function (req: express.Request, res: express.Request): void {
                expect(res).to.exist;
                expect(res).to.have.status(200);
                expect(res.body).to.contain.key("success", "users");
                expect(res.body.success).to.be.equal(true);
                expect(res.body.users[0]).to.contain.key("id", "name", "id_roles", "login");
                done();
            });
    });

    it('PATCH -> reset password', function (done): void {
        body = {
            password: 'Vtqlf&wD'
        };
        chai.request(connection).patch('/users/password')
            .set(headers)
            .send(body)
            .end(function (req: express.Request, res: express.Request): void {
                expect(res).to.exist;
                expect(res).to.have.status(200);
                expect(res.body).to.contain.key("success");
                expect(res.body.success).to.be.equal(true);
                done();
            })

    })

    it('PATCH -> reset password with missing parameters', function (done): void {
        body = {}
        chai.request(connection).patch('/users/password')
            .set(headers)
            .send(body)
            .end(function (req: express.Request, res: express.Request): void {
                expect(res).to.exist;
                expect(res).to.have.status(422);
                expect(res.body).to.contain.key("success", "message");
                expect(res.body.success).to.be.equal(false);
                expect(res.body.message).to.be.equal("Missing parameters.");
                done();
            })
    })
});
