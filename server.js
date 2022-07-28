process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 😀 SHUTTING DOWN...');
  console.log(err.name, err.message);

  process.exit(1);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connect successfully'));

// .catch((err) => console.log('ERROR'));

const port = process.env.PORT || 8000;
// console.log(process.envs);
const server = app.listen(port, () => {
  console.log(`serv listen on 3000`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandle rejection! 😀😅 Shutting down');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIVED, shutting down greatfully 😀😅😀😅😀😅');
  server.close(() => {
    console.log('😀😅😀😅 process terminated');
  });
});
