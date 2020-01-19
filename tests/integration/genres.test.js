const request = require('supertest');
const { Genre } = require('../../models/genres');

let server;
describe('/api/genres', () => {
    beforeEach(() => {server = require('../../index')});
    afterEach( async () => { 
        server.close()
        await Genre.remove({});
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
});