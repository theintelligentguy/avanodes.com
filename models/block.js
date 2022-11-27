const mongoose = require('mongoose');
const blockSchema = new mongoose.Schema({
    _id: String,
    blockID: String,
    height: Number,
    age: Number,
    createdAt: Date,
    gasUsed: String,
    transactions: Number,
    total_burned: Number,
    volume: Number,
    size: Number
},
    {
        _id: false,
        timestamps: true,
    });

module.exports = mongoose.models.Block || mongoose.model('Block', blockSchema);
