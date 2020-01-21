const request = require('supertest');
const { Genre } = require('../../../models/genres');
const { User } = require('../../../models/users');

describe('Authorization middleware', () => {
    beforeEach(() => {server = require('../../../index')});
    afterEach( async () => { 
        await server.close()
        await Genre.remove({}); // cleans up DB after test
    });

    let token;
    //Happy Path
    const exec = () => {
        return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1'}) //send valid data so that error is from auth
    }

    it('should return 400 if token is invalid', async () => {
        token = '1234';
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 401 if token is not provided', async () => {
        token = '';
        
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 200 if token is valid', async () => {
        token = new User().generateAuthToken();
        
        const res = await exec();

        expect(res.status).toBe(200);
    });
});