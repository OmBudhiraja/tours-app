const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION , SHUTTING DOWN!');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

const dbConnectionUrl = process.env.DATABASE_URL;

mongoose.connect(dbConnectionUrl).then(() => console.log('db connected'));

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION , SHUTTING DOWN!');
  server.close(() => {
    process.exit(1);
  });
});
