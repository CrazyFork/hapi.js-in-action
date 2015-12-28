'use strict';

const after = function (server, next) {

    const appName = server.settings.app.appName;

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        helpersPath: 'templates/helpers',
        partialsPath: 'templates/partials',
        path: 'templates',
        layout: true,
        isCached: false
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            server.methods.database.getRecent((err, pings) => {

                if (err) {
                    throw err;
                }

                reply.view('home', {
                    pings: pings,
                    appName: appName
                });
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/flight/{code}',
        handler: function (request, reply) {

            const code = request.params.code;

            server.methods.database.getFlight(code, (err, pings) => {

                if (err) {
                    throw err;
                }

                reply.view('flight', {
                    pings: pings,
                    code: code,
                    appName: appName
                });
            });
        }
    });

    next();
};

exports.register = function (server, options, next) {

    server.dependency(['pingoo-database', 'vision'], after);
    next();
};

exports.register.attributes = require('./package');
