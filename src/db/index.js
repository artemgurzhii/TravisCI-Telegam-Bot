import pg from 'pg';

/**
 * Initialize client for future requests.
 * @class
 * @classdesc All methods with database.
 */
class DB {

  /**
   * Used to send requests.
   * @param {Object} client - All methods available.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Used to send requests.
   * @param {number} from - All methods available.
   * @param {string} url - All methods available.
   * @param {string} client - All methods available.
   */
  update(from, url, json) {
    this.client.query(
      'UPDATE TravisCITelegamBot SET url=($2), json=($3) WHERE id=($1)',
      [from, url, json]
    );
  }

  insert(from, url, json) {
    this.client.query(
      'INSERT INTO TravisCITelegamBot(id, url, json) values($1, $2, $3)',
      [from, url, json]
    );
  }

  delete(id) {
    this.client.query(
      'DELETE FROM TravisCITelegamBot WHERE id=($1)',
      [id]
    );
  }

  selectURL(from) {
    return new Promise((resolve, reject) => {
      let results = [this];
      const query = this.client.query(
        'SELECT * FROM TravisCITelegamBot WHERE id=($1)',
        [from]
      );

      query.on('row', row => {
        results.push(row);
      });
      query.on('end', () => {
        resolve(results);
      });
    });
  }

  selectAll() {
    return new Promise((resolve, reject) => {
      let results = [];
      const query = this.client.query(
        'SELECT * FROM TravisCITelegamBot'
      );
      query.on('row', row => {
        results.push(row);
      });
      query.on('end', () => resolve(results));
    });
  }
}

export default function store() {
  return new Promise((resolve, reject) => {
    pg.connect(process.env.DATABASE_URL, (err, client, done) => {
      if (err) throw err;
      client.query(
        'CREATE TABLE IF NOT EXISTS TravisCITelegamBot(id SERIAL PRIMARY KEY, url VARCHAR(100), json VARCHAR(120))');
      const database = new DB(client);
      return resolve(database);
    });
  });
}
