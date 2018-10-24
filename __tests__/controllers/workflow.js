const request = require('supertest');
const app = require('../../app');
const mainDb = require('../../database/main');


let jwtToken1;
let userId1;
let userId2;

const username1 = '___testuser1___';
const password1 = '___testpass1___';
const newPassword1 = '___testpass1___new';
const username2 = '___testuser2___';
const password2 = '___testpass2___';

/**
 * This workflow signups 2 users with two different credentials.
 * It then logs in as user 1, likes him, checks most liked, unlikes him, checks most liked again.
 */
describe('Workflow test', () => {

    test('It should signup a user 1', async () => {
        let response = await request(app)
            .post('/signup')
            .type('form')
            .send({
                username: username1,
                password: password1
            });
        expect(response.statusCode).toBe(200);
    });

    test('It should signup a user 2', async () => {
        let response = await request(app)
            .post('/signup')
            .type('form')
            .send({
                username: username2,
                password: password2
            });
        expect(response.statusCode).toBe(200);
    });

    test('It should log in as a user and fetch JWT token and user id of user 1', async (done) => {
        let response = await request(app)
            .post('/login')
            .type('form')
            .send({
                username: username1,
                password: password1
            });
        let result = JSON.parse(response.text);
        if (typeof result.jwtToken !== 'undefined') {
            jwtToken1 = result.jwtToken;
        } else {
            done.fail(new Error('JWT token was not provided'));
        }
        if (typeof result.userId !== 'undefined') {
            userId1 = result.userId;
        } else {
            done.fail(new Error('User id was not provided'));
        }
        expect(response.statusCode).toBe(200);
        done();
    });

    test('It should log in as a user and fetch user id of user 2', async (done) => {
        let response = await request(app)
            .post('/login')
            .type('form')
            .send({
                username: username2,
                password: password2
            });
        let result = JSON.parse(response.text);
        if (typeof result.userId !== 'undefined') {
            userId2 = result.userId;
        } else {
            done.fail(new Error('User id was not provided'));
        }
        expect(response.statusCode).toBe(200);
        done();
    });

    test('It should get user 1 info', async (done) => {
        let response = await request(app)
            .get('/me')
            .set('Authorization', 'Bearer ' + jwtToken1);
        let result = JSON.parse(response.text);
        if (typeof result.username === 'undefined') {
            done.fail(new Error('Username was not provided'));
        }
        if (typeof result.userId === 'undefined') {
            done.fail(new Error('User id was not provided'));
        }
        expect(result.userId).toBe(userId1);
        expect(result.username).toBe(username1);
        done();
    });

    test('It should change user 1 password', async (done) => {
        let response = await request(app)
            .post('/me/update-password')
            .type('form')
            .send({
                password: newPassword1
            })
            .set('Authorization', 'Bearer ' + jwtToken1);
        expect(response.statusCode).toBe(200);
        done();
    });

    test('It should like user 2', async (done) => {
        let response = await request(app)
            .post('/user/' + userId2 + '/like')
            .type('form')
            .set('Authorization', 'Bearer ' + jwtToken1);
        expect(response.statusCode).toBe(200);
        done();
    });

    test('It should get user 2 info and get 1 like', async (done) => {
        let response = await request(app)
            .get('/user/' + userId2);
        let result = JSON.parse(response.text);
        if (typeof result.likes === 'undefined') {
            done.fail(new Error('Number of likes was not provided'));
        }
        if (typeof result.username === 'undefined') {
            done.fail(new Error('Username was not provided'));
        }
        expect(result.username).toBe(username2);
        expect(result.likes).toBe(1);
        done();
    });

    test('It should find user 2 in most liked and view 1 like', async (done) => {
        let response = await request(app)
            .get('/most-liked');
        let results = JSON.parse(response.text);
        let found = false;
        results.forEach(function (el) {
            if (el.userId === userId2) {
                found = true;
                expect(el.likeCount).toBe(1);
            }
        });
        if (!found) {
            done.fail(new Error('User id 2 was not found'));
        }
        done();
    });

    test('It should unlike user 2', async (done) => {
        let response = await request(app)
            .post('/user/' + userId2 + '/unlike')
            .type('form')
            .set('Authorization', 'Bearer ' + jwtToken1);
        expect(response.statusCode).toBe(200);
        done();
    });

    test('It should get user 2 info and get 0 likes', async (done) => {
        let response = await request(app)
            .get('/user/' + userId2);
        let result = JSON.parse(response.text);
        if (typeof result.likes === 'undefined') {
            done.fail(new Error('Number of likes was not provided'));
        }
        if (typeof result.username === 'undefined') {
            done.fail(new Error('Username was not provided'));
        }
        expect(result.username).toBe(username2);
        expect(result.likes).toBe(0);
        done();
    });

});

afterAll(() => {
    console.log('after all');
    if (userId1 != null) {
        mainDb.query('DELETE FROM user_like WHERE user_id = ?', [userId1]);
        mainDb.query('DELETE FROM user_like WHERE like_user_id = ?', [userId1]);
    }
    if (userId2 != null) {
        mainDb.query('DELETE FROM user_like WHERE user_id = ?', [userId2]);
        mainDb.query('DELETE FROM user_like WHERE like_user_id = ?', [userId2]);
    }
    mainDb.query('DELETE FROM user WHERE username = ?', [username1]);
    mainDb.query('DELETE FROM user WHERE username = ?', [username2]);
});