var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EmailSchema = new Schema(
    {
        username: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100},
        email: {type: String, required: true},
    }
);

//Export model
module.exports = mongoose.model('Emails', EmailSchema);