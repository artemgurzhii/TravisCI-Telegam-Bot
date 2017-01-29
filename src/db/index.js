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
      'UPDATE TravisCITelegamBot SET url=($2), json=($3), watching=($4) WHERE id=($1)',
      [from, url, json, true]
    );
  }

  insert(from, url, json) {
    this.client.query(
      'INSERT INTO TravisCITelegamBot(id, url, json, watching) values($1, $2, $3, $4)',
      [from, url, json, true]
    );
  }

  delete(id) {
    this.client.query(
      'DELETE FROM TravisCITelegamBot WHERE id=($1)',
      [id]
    );
  }

  watchingState(from, bool) {
    this.client.query(
      'UPDATE TravisCITelegamBot SET watching=($2) WHERE id=($1)',
      [from, bool]
    );
  }

  async selectURL(from) {
    // TODO: remove first element from array(this, which is database object)
    let results = [this];
    await this.client.query(
      'SELECT * FROM TravisCITelegamBot WHERE id=($1)',
      [from]
    ).on('row', row => {
      results.push(row);
    });
    return results;
  }

  async selectAll() {
    let results = [];
    await this.client.query(
      'SELECT * FROM TravisCITelegamBot'
    ).on('row', row => {
      results.push(row);
    });
    return results;
  }
}


// TODO: Move this into constructor so it will not create new connection,
// TODO: each time when functions is called
// TODO: Replace promise with async/await
export default function store() {
  return new Promise((resolve, reject) => {
    pg.connect(process.env.DATABASE_URL, (err, client, done) => {
      if (err) throw err;
      client.query(
        'CREATE TABLE IF NOT EXISTS TravisCITelegamBot(id SERIAL PRIMARY KEY, url VARCHAR(100), json VARCHAR(120), watching BOOLEAN)');
      const database = new DB(client);
      return resolve(database);
    });
  });
}
