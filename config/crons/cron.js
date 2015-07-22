module.exports = {
  '* */15 * * * *': function() {
    console.log('Scheduled cron job is running: every 15min.')
  },
  '*/5 * * * * *': function() {
    console.log('Scheduled cron job is running: every 5sec');
  }
}