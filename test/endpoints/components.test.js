const assert = require('assert');
var sinon = require('sinon');
var supertest = require('supertest');

request = supertest('http://localhost:3000');

describe('/components', () => {
    it('GET /:componentId', done => {
        request.get('/components')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
    it('POST /', done => {
        done();
    });
    it('PUT /:componentId', () => {
        assert.strictEqual('vincent ist ein mulluk', "vincent ist ein mulluk")
    })
});