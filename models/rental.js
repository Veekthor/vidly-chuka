const Joi = require('joi');
const moment = require('moment');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                trim: true,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255     
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: Date,
    rentalFee: {
        type: Number,
        min: 0
    }
});
//Add (static) method to user schema
rentalSchema.statics.lookup = function(customerId, movieId){
    return this.findOne({
        'customer._id': customerId, 
        'movie._id': movieId 
    });
};

rentalSchema.methods.return = function(){
    this.dateReturned = new Date(); //set return date

    const diffDays = moment().diff(this.dateOut, 'days'); //calculate the days difference
    this.rentalFee = diffDays * this.movie.dailyRentalRate;
};
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental; 