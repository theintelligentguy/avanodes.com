const mongoose = require('mongoose');

const peerSchema = new mongoose.Schema({
  ip: String,
  publicIP: String,
  nodeID: String,
  version: String,
  lastSent: Date,
  lastReceived: Date,
  country_code: String,
  country_name: String,
  city: String,
  latitude: Number,
  longitude: Number,
  country_flag: String,
},
{
  timestamps: true
});

const Peer = mongoose.models.Peer || mongoose.model('Peer', peerSchema)

module.exports = Peer
