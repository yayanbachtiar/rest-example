const pm2 = require('pm2');

pm2.connect(() => {
  pm2.start(
    {
      name: 'Express-Play',
      script: `${__dirname}/dist/app.js`,
      max_memory_restart: `${process.env.WEB_MEMORY || 512}M`,
      exec_mode: 'cluster',
      instances: process.env.WEB_CONCURRENCY || -1,
    },
    (err) => {
      if (err) {
        console.error(`Error while launching applications ${err.stack || err}.`);
        return;
      }

      console.log('PM2 and application has been succesfully started.');

      pm2.launchBus((errLb, bus) => {
        console.log('PM2: Log streaming started.');
        bus.on('log:out', packet => console.log(`App (out): ${packet.process.name} - ${packet.data}`));
        bus.on('log:err', packet => console.error(`App (err): ${packet.process.name} - ${packet.data}`));
      });
    },
  );
});
