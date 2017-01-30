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
   * Update user record(object) in current table. Used if user already exist in db.
   * @param {number} id - User id.
   * @param {string} url - TravisCI link.
   * @param {string} json - JSON url for future https requests.
   */
  update(id, url, json) {
    this.client.query(
      'UPDATE TravisCITelegamBot SET url=($2), json=($3), watching=($4) WHERE id=($1)',
      [id, url, json, true]
    );
  }

  /**
   * Insert new record(object) into table. Used if user not exist in db.
   * @param {number} id - User id.
   * @param {string} url - TravisCI link.
   * @param {string} json - JSON url for future https requests.
   */
  insert(id, url, json) {
    this.client.query(
      'INSERT INTO TravisCITelegamBot(id, url, json, watching) values($1, $2, $3, $4)',
      [id, url, json, true]
    );
  }

  /**
   * Delete record(object) from db for user id.
   * @param {number} id - User id number.
   */
  delete(id) {
    this.client.query(
      'DELETE FROM TravisCITelegamBot WHERE id=($1)',
      [id]
    );
  }

  /**
   * Change user watching state to true/false.
   * @param {number} id - User id number.
   * @param {boolean} isWatching - User watching state.
   */
  watchingState(id, isWatching) {
    this.client.query(
      'UPDATE TravisCITelegamBot SET watching=($2) WHERE id=($1)',
      [id, isWatching]
    );
  }

  /**
   * Select url(.json) for https request from user.
   * @param {number} id - User id number.
   */
  async selectURL(id) {
    let db = [];
    await this.client.query(
      'SELECT * FROM TravisCITelegamBot WHERE id=($1)',
      [id]
    ).on('row', row => {
      db.push(row);
    });
    return db;
  }

  /**
   * Select all from database.
   */
  async selectAll() {
    let db = [];
    await this.client.query(
      'SELECT * FROM TravisCITelegamBot'
    ).on('row', row => {
      db.push(row);
    });
    return db;
  }
}

/**
 * Connect to database, create table and export function.
 */
export default async function store() {
  const client = await pg.connect(process.env.DATABASE_URL);
  client.query('CREATE TABLE IF NOT EXISTS TravisCITelegamBot(id SERIAL PRIMARY KEY, url VARCHAR(100), json VARCHAR(120), watching BOOLEAN)');
  return new DB(client);
}
