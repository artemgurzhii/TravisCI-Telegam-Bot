import pg from 'pg';
import Messenger from './src/lib/messenger';

pg.connect(process.env.DATABASE_URL, (err, client, done) => {
  client.query('DROP TABLE IF EXISTS TravisCITelegamBot');
  client
    .query(
      'CREATE TABLE IF NOT EXISTS TravisCITelegamBot(id SERIAL PRIMARY KEY, url VARCHAR(100) not null)'
    , (err, result) => {
    if (err) throw err;

    client.end(err => {
      if (err) throw err;
    });
  });
});

const telegram = new Messenger();

telegram.listen();
