const next = require('next')
const routes = require('./routes')
const app = next({ dev: process.env.NODE_ENV !== 'production' })

const express = require('express')

const mongoose = require('mongoose')
const Agenda = require('agenda')

const addCheckStatsJob = require('./jobs/check-stats')
const addCheckNotifierStatsJob = require('./jobs/check-notifier-stats')
const addCheckNodesJob = require('./jobs/check-nodes')
const addCheckPeersJob = require('./jobs/check-peers')
const addCheckPeerIpsJob = require('./jobs/check-peer-ips')
const addCleanCompletedJobsJob = require('./jobs/clean-completed-jobs')

const handler = routes.getRequestHandler(app, ({ req, res, route, query }) => {
  // console.log('handler', route, query, req.nextRoute.data)
  app.render(req, res, route.page, query)
})

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!

  app.prepare().then(() => {
    express().use(handler).listen(3000)
  })

});

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
});

addCheckNotifierStatsJob.job(agenda)
addCheckStatsJob.job(agenda)
addCheckNodesJob.job(agenda)

if (process.env.START_JOBS && process.env.START_JOBS === 'true') {
  addCheckPeersJob.job(agenda)
  addCheckPeerIpsJob.job(agenda)
}

addCleanCompletedJobsJob.job(agenda)

async function graceful() {
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

(async function () { // IIFE to give access to async/await
  await agenda.start();

  await agenda.every('5 minutes', ['check stats', 'check notifier stats']);

  if (process.env.START_JOBS && process.env.START_JOBS === 'true') {
    await agenda.every('10 minutes', ['check peers']);
  }

  await agenda.every('1 hour', ['check nodes']);

  await agenda.every('1 day', ['clean completed jobs']);

  await agenda.cancel({ nextRunAt: null }, (err, numRemoved) => {
    debug(err);
    debug('Number of finished jobs removed', numRemoved);
  });
})();
