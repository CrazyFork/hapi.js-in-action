const Assert = require('assert');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

lab.test('addition should add two numbers together', function (done) {

    Assert(1 + 1 === 2);
    done();
});
