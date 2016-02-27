'use strict';

// Catflap is open   => 0dd31dde3980c1b7ecee12e0c52d85a5
// Ink is dry        => 65e11a21872da5477187bcdbfa1ef25f
// Bird has flown    => ef2de8d315317333f7930901287fa768

const Crypto = require('crypto');
const Hapi = require('hapi');
const Path = require('path');
const Fs = require('fs');

const server = new Hapi.Server();
server.connection({ port: 4000 });

server.method('readKey', (request, reply) => {

    Fs.readFile(Path.join(__dirname, 'key.txt'), 'utf8', (err, data) => {

        if (err) {
            throw err;
        }
        reply(data.trim());
    });
});

server.method('decryptMessage', (request, reply) => {

    const decipher = Crypto.createDecipher('aes-256-cbc', request.pre.readKey);
    let cleartext = decipher.update(request.payload.message, 'hex', 'utf8');
    cleartext += decipher.final('utf8');

    reply(cleartext);
});

server.method('convertMessage', (request, reply) => {

    const messages = {
        'Catflap is open': 'I have infiltrated the base',
        'Ink is dry': 'I have the blueprints',
        'Bird has flown': 'I am making my escape'
    };

    reply(messages[request.pre.decryptMessage]);
});

server.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {

        console.log(new Date() + ': Incoming payload');

        console.log('Encrypted message: ' + request.payload.message);
        console.log('Decrypted message: ' + request.pre.decryptMessage);
        console.log('Converted message: ' + request.pre.convertMessage);

        reply('ok');
    },
    config: {
        pre: [
            'readKey',
            'decryptMessage',
            'convertMessage'
        ]
    }
});

server.start(() => {

    console.log('Server started!');
});
