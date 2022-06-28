const mongoose = require('mongoose')


const userScema = new mongoose.Schema({
    email: String,
    pass: String
    
    
}, { timestamps: true })

module.exports = mongoose.model('useer', userScema)


