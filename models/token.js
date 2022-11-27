const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    _id: String,
    name:String,
    tokenID: String,
    createdAt: Date,
    supply_amount:Number,
    supply_unit:String
},
    {
        _id: false,
        timestamps: true,
    });

module.exports = mongoose.models.Token || mongoose.model('Token', tokenSchema);
