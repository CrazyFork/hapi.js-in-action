'use strict';

const Hapi = require('hapi');
const Path = require('path');

const server = new Hapi.Server();
server.connection({ port: 4000 });

server.register([
    require('vision'),
    require('hapi-auth-cookie'),
    { register: require('crumb'), options: { restful: true } }
], (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        layout: true,
        path: Path.join(__dirname, 'views'),
        isCached: false
    });

    server.auth.strategy('session', 'cookie', {
        password: 'a51bq0LqVQRqM5y4',
        isSecure: false
    });

    server.route([{
        method: 'GET',
        path: '/',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: function (request, reply) {

                const message = request.auth.isAuthenticated ?
                    request.auth.credentials.message :
                    'Feeling great!';
                request.auth.session.set({ message: message });
                reply.view('index', { message: message });
            }
        }
    }, {
        method: 'PUT',
        path: '/change',
        config: {
            auth: 'session',
            handler: function (request, reply) {

                request.auth.session.set({ message: request.payload.message });
                reply.redirect('/');
            }
        }
    }, {
        method: 'GET',
        path: '/evil',
        handler: {
            view: 'evil'
        }
    }]);

    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server listening at:', server.info.uri);
    });
});
