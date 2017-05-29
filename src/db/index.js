import pg from 'pg';

/**
 * Initialize client for database requests.
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
   * @param {string} url - Received TravisCI link.
   * @param {string} json - JSON url for https requests.
   * @param {number} build - Current build number.
   */
  update(id, url, json, build) {
    this.client.query(
      'UPDATE TravisCITelegamBot SET url=($2), json=($3), watching=($4), build=($5), watchonlyfailing=($6) WHERE id=($1)',
      [id, url, json, true, build, false]
    );
  }

  /**
   * Insert new record(object) into table. Used if user not exist in db.
   * @param {number} id - User id.
   * @param {string} url - Received TravisCI link.
   * @param {string} json - JSON url for https requests.
   * @param {number} build - Current build number.
   */
  insert(id, url, json, build) {
    this.client.query(
      'INSERT INTO TravisCITelegamBot(id, url, json, watching, build, watchonlyfailing) values($1, $2, $3, $4, $5, $6)',
      [id, url, json, true, build, false]
    );
  }

  buildsToNotify(id, watchonlyfailing) {
    this.client.query(
      'UPDATE TravisCITelegamBot SET watchonlyfailing=($2) WHERE id=($1)',
      [id, watchonlyfailing]
    );
  }

  /**
   * Update previous build number.
   * @param {number} id - User id number.
   * @param {number} build - Current build number.
   */
  updateBuild(id, build) {
    this.client.query(
      'UPDATE TravisCITelegamBot SET build=($2) WHERE id=($1)',
      [id, build]
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
   * @param {boolean} watching - User watching state.
   */
  watchingState(id, watching) {
    this.client.query(
      'UPDATE TravisCITelegamBot SET watching=($2) WHERE id=($1)',
      [id, watching]
    );
  }

  /**
   * Select url(.json) for https request from user.
   * @param {number} id - User id number.
   * @return {Array} User url.
   */
  async selectURL(id) {
    let db = [];
    await this.client.query(
      'SELECT url FROM TravisCITelegamBot WHERE id=($1)',
      [id]
    ).on('row', row => {
      db.push(row);
    });
    return db;
  }

  /**
   * Select previous build number.
   * @param {number} id - User id number.
   * @return {Array} User last build number.
   */
  async selectBuild(id) {
    let db = [];
    await this.client.query(
      'SELECT build FROM TravisCITelegamBot WHERE id=($1)',
      [id]
    ).on('row', row => {
      db.push(row);
    });
    return db;
  }

  /**
   * Select all from database.
   * @return {Array} All data in the database.
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
  client.query('CREATE TABLE IF NOT EXISTS TravisCITelegamBot(id SERIAL PRIMARY KEY, url VARCHAR(100), json VARCHAR(120), watching BOOLEAN, build VARCHAR(9), watchonlyfailing BOOLEAN)');
  return new DB(client);
}
