'use strict';

const Hapi = require('hapi');
const Path = require('path');

const server = new Hapi.Server();
server.connection({ port: 4000 });

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: function (request, reply) {

                reply.file(Path.join(__dirname, 'index.html'));
            }
        }, {
            config: {
                cors: true
            },
            method: 'GET',
            path: '/resource',
            handler: function (request, reply) {

                reply('A resource');
            }
        }
    ]);

    server.start(() => {

        console.log('Started server');
    });
});
