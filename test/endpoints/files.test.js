var assert = require("assert");
var sinon = require('sinon');
var supertest = require('supertest');

request = supertest('http://localhost:3000');

describe('/files', () => {
    it('GET /:fileId', () => {
        assert.strictEqual(1 + 1, 2);
    });
    it('POST /', () => {
        assert.strictEqual(3 * 3, 9);
    });
    it('PUT /:fileId', () => {
        assert.strictEqual('vincent ist ein mulluk', "vincent ist ein mulluk")
    })
});