const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    _id: String,
    transactionID:String,
    from: String,
    to:String,
    age:Number,
    avax_amount:Number,
    status:String,
    createdAt:Date,
},
    {
        _id: false,
        timestamps: true,
    });

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
