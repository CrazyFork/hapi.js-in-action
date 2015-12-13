'use strict';

const Code = require('code');
const Lab = require('lab');
const Sinon = require('sinon');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const experiment = lab.experiment;
const test = lab.test;
const beforeEach = lab.beforeEach;

let server;

beforeEach((done) => {

    require('..')((err, srv) => {

        if (err) {
            throw err;
        }

        server = srv;
        done();
    });
});

experiment('Test POST /user', () => {

    test('creates a user object (spy)', (done) => {

        server.app.db.collection = function () {

            return {
                insertOne: function (doc, callback) {

                    doc._id = 'abcdef';
                    callback(null, { ops: [doc] });
                }
            };
        };

        const spy = Sinon.spy(server.app.db, 'collection');

        const user = {
            name: {
                first: 'Craig',
                last: 'Railton'
            },
            age: 29
        };

        const options = {
            method: 'POST',
            url: '/user',
            payload: user
        };

        server.inject(options, (res) => {

            expect(spy.calledOnce).to.be.true();
            expect(spy.calledWith('users')).to.be.true();

            spy.restore();

            done();
        });
    });

    test('creates a user object (stub)', (done) => {

        const stub = Sinon.stub(server.app.db, 'collection', (doc, callback) => {

            return {
                insertOne: function (doc2, cb) {

                    doc2._id = 'abcdef';
                    cb(null, { ops: [doc2] });
                }
            };
        });

        const user = {
            name: {
                first: 'Craig',
                last: 'Railton'
            },
            age: 29
        };

        const options = {
            method: 'POST',
            url: '/user',
            payload: user
        };

        server.inject(options, (res) => {

            expect(stub.calledOnce).to.be.true();
            expect(stub.calledWith('users')).to.be.true();

            stub.restore();

            done();
        });
    });
});
