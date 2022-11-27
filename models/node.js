const mongoose = require('mongoose');

// type RewardOwner {
//   locktime: Float
//   threshold: String
//   addresses: [String]
// }

// nodeID: ID
// txID: String
// startTime: Float
// endTime: Float
// stakeAmount: Float
// potentialReward: Float
// rewardOwner: RewardOwner
// delegators: Delegators
// isPartner: Boolean
// isSponsored: Boolean
// delegationFee: Float
// uptime: String
// connected: Boolean
// country_code: String
// latitude: Float
// longitude: Float
// country_flag: String
// maxYield: Float
// totalStacked: Float
// leftToStack: Float
// stackedPercent: Float
// leftToStackPercent: Float
// networkShare: Float
// grossRewards: Float
// netRewards: Float
// uptimePercent: String
// version: String
// publicIP: String
// country: String
// city: String

const nodeSchema = new mongoose.Schema({
  _id: String,
  delegatorsCount: Number,
  delegatorsTotalStake: Number,
  txID: String,
  startTime: Number,
  endTime: Number,
  stakeAmount: Number,
  potentialReward: Number,
  rewardOwner: String,
  // delegators: Delegators,
  isPartner: Boolean,
  isSponsored: Boolean,
  delegationFee: Number,
  uptime: String,
  connected: Boolean,
  country_code: String,
  latitude: Number,
  longitude: Number,
  country_flag: String,
  maxYield: Number,
  totalStacked: Number,
  leftToStack: Number,
  stackedPercent: Number,
  leftToStackPercent: Number,
  networkShare: Number,
  grossRewards: Number,
  netRewards: Number,
  uptimePercent: String,
  version: String,
  publicIP: String,
  country: String,
  city: String,
},
{
  _id: false,
  timestamps: true,
});

// nodeSchema
  // .pre('find', function() {
  //   this.populate('observableAddresses');
  // })
  // .pre('findOne', function() {
  //   this.populate('observableDelegators');
  // });

module.exports = mongoose.models.Node || mongoose.model('Node', nodeSchema);
