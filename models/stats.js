const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  key: String,
  totalNodes: Number,
  totalTransactions: Number,
  totalProviders: Number,
  totalDelegations: Number,
  totalBlocks: Number,
  totalParticipation: Number,
},
{
  timestamps: true
});

const Stats = mongoose.models.Stats || mongoose.model('Stats', statsSchema)

module.exports = Stats
