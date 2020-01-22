const { User } = require('../../../models/users');
const request = require('supertest');

describe('/api/customers', () => {
    let server
    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach( async () => {
        await server.close();
    });
    describe('POST /', () => {
        it('should return 400 if name is more than 50 characters', async () => {
            const token = new User().generateAuthToken();
            const name = new Array(52).join('a');
            const res = await request(server).post('/api/customers')
            .set('x-auth-token', token)
            .send({
                name,
                phone: '12345',
                isGold: false
            });

            expect(res.status).toBe(400);
        });
    });
});