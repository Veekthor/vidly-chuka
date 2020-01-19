const { User } = require('../../../models/users');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');


describe('Authorization middleware', () => {
    it('should set req.user with payload of a valid JWT', () =>{
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

        const token = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token)        // mock req.header
        };

        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    } );
});