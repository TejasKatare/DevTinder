const corn = require("node-cron");

corn.schedule('0 17 * * *', () => {
  console.log('running a task every sec: '+ new Date());
});