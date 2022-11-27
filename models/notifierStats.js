const mongoose = require('mongoose');

const notifierStatsSchema = new mongoose.Schema({
  key: String,
  users: Number,
  total: Number,
},
{
  timestamps: true
});

const NotifierStats = mongoose.models.NotifierStats || mongoose.model('NotifierStats', notifierStatsSchema)

module.exports = NotifierStats
