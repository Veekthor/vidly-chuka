const request = require('supertest');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/users');

let server;
describe('/api/genres', () => {
    beforeEach(() => {server = require('../../index')});
    afterEach( async () => { 
        server.close()
        await Genre.remove({}); // cleans up DB after test
    });
    describe('GET /', () => {
        it('should return all genres', async () =>{

            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre3'}
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre3')).toBeTruthy();
        });
    });
    describe('GET /:id', () =>{
        it('should return a 404 error if invalid ID is provided', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
            // expect(res.body).toBe('Genre does not exist');
        });

        it('should return genre if valid ID is provided', async () => {
            const genre = new Genre({name: 'genre1'});
            await genre.save();
            
            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
    describe('POST /', () => {
        it('should return 401 if user is not logged in', async() => {
            const res = await request(server)
                                .post('/api/genres')
                                    .send({ name: 'genre1'});

            expect(res.status).toBe(401);
        });

        it('should return 400 if user is logged in and input(name) is less than 5 characters', async() => {
            const token = new User().generateAuthToken(); //generate valid jwt
            const res = await request(server)
                                .post('/api/genres')
                                    .set('x-auth-token', token) //setting header for request
                                        .send({ name: '1234'});

            expect(res.status).toBe(400);
        });

        it('should return 400 if user is logged in and input(name) is more than 50 characters', async() => {
            const token = new User().generateAuthToken(); //generate valid jwt

            const name = new Array(52).join('a');
            const res = await request(server)
                                .post('/api/genres')
                                    .set('x-auth-token', token) //setting header for request
                                        .send({ name: name});

            expect(res.status).toBe(400);
        });

        it('should save genre if user is logged in and input(name) is valid', async() => {
            const token = new User().generateAuthToken(); //generate valid jwt

            const res = await request(server)
                                .post('/api/genres')
                                    .set('x-auth-token', token) //setting header for request
                                        .send({ name: 'genre1'});
                                        
            const genre = await Genre.find({name: 'genre1'});

            expect(res.status).toBe(200);
            expect(genre[0]).not.toBeUndefined();
        });

        it('should send genre in response if input is valid', async() => {
            const token = new User().generateAuthToken(); //generate valid jwt

            const res = await request(server)
                                .post('/api/genres')
                                    .set('x-auth-token', token) //setting header for request
                                        .send({ name: 'genre1'});
            
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ name: 'genre1'});
            expect(res.body).toHaveProperty('_id');
        });
    });
});