const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    _id: String,
    data: Object,
    
});

module.exports = mongoose.model('Document', Schema);