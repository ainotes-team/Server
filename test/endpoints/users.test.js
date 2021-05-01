const assert = require('assert');
const sinon = require('sinon');
const supertest = require('supertest');
const express = require('express');

request = supertest('http://localhost:3000');

describe('/users', () => {
    // already registered

    // it('POST / -- register', done => {
    //     request.post('/users')
    //         .send(JSON.stringify({
    //             "username": "asdf",
    //             "password": "thisIsAdummY123!",
    //             "email": "test@test.de"
    //         }))
    //         .set("content-type", "application/json")
    //         .expect(200)
    //         .end(function(err, res) {
    //             if (err) return done(err);
    //             done();
    //         });
    // });
    it('POST /login -- login', done => {
        request.post('/users/login')
            .send(JSON.stringify({
                "email": "test@test.de",
                "password": "thisIsAdummY123!"
            }))
            .set("content-type", "application/json")
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                const responseText = res.res.text;
                assert(JSON.parse(responseText).token.length === 153) //
                done();
            });
    });
});