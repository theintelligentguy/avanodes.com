const mongoose = require('mongoose');

// https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/pages/api/pets/index.js

const delegatorSchema = new mongoose.Schema({
  // _id: String,
  nodeID: String,
  txID: String,
  startTime: Number,
  endTime: Number,
  stakeAmount: Number,
  rewardOwner: String,
  potentialReward: Number,
},
{
  // _id: false,
  timestamps: true,
});

module.exports = mongoose.models.Delegator || mongoose.model('Delegator', delegatorSchema);
