/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  sails.services.passport.loadStrategies();

  // CRON JOBS FOR INFLUENCERS, HASHTAGS, MENTIONS
  // Runs every 15 minutes

  const TIMEZONE = 'America/Los_Angeles';

  var CronJob = require('cron').CronJob;
  var cronJobs = Object.keys(sails.config.cron);

  cronJobs.forEach(function(key) {
    var value = sails.config.cron[key];
    new CronJob(key, value, null, true, TIMEZONE);
  })

  sails.config.twitterstream();

    // new CronJob('00 * * * * *', function() {
    //   console.log(new Date(), 'You will see this message every minute.');
    // }, null, true, TIMEZONE);

  cb();

};
