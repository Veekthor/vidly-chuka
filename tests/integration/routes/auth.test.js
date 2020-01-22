const { User } = require('../../../models/users');
const request = require('supertest');
const bcrypt = require('bcrypt');
describe('/api/auth', () => {
    let server
    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach( async () => {
        await server.close();
    });

    describe('POST /', () => {
        let email,
        password;
        //Happy path
        const exec = () => {
            return request(server)
                    .post('/api/auth')
                    .send({
                        email,
                        password
                    })
        };

        beforeEach( async () => {
            password = '12345';
            email = '12345@gmail.com'
            
            const hashedPassword = await bcrypt.hash(password,10);
            
            const user = new User({
                name: '12345',
                email,
                password: hashedPassword
            });

            await user.save();
        });
        
        afterEach( async () => {
            await User.remove({});
        });

        it('should return 400 if password is more than 255 characters', async () => {
            password = new Array(257).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });
    });

});