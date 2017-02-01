import request from 'request-promise';

/**
 * Get JSON data from the requested url.
 * @param {String} url - Url for reqguest.
 * @return {Object} JSON Object with data from the last build.
 */
async function getJSON(url) {
  const body = await request.get(url);

  return JSON.parse(body);
}

/**
 * Slice received message to get url for request.
 * @param {String} msg - Message received from user.
 * @return {String} Link for request.
 */
function jsonURL(msg) {
  const id = /\.org\/([^\s]+)\//.exec(msg)[1];
  const repository = /.+\/([^\s]+)/.exec(msg)[1];

  return `https://api.travis-ci.org/repositories/${id}/${repository}.json`;
}

/**
 * Get build time duration.
 * @param {Object} json - Parsed json object returned from request.
 * @return {Array} Time build started and ended at.
 */
function getTime(json) {
  const started = /T(.+)Z/.exec(json.last_build_started_at)[1];
  const ended = /T(.+)Z/.exec(json.last_build_finished_at)[1];

  return [started, ended];
}

function cycle(users) {

  let latestUsers;
  let intervalId;

  latestUsers = users;

  if (!intervalId) {
    intervalId = setInterval(() => {
      latestUsers.forEach(user => {
        helpers
          .getJSON(user.json)
          .then(json => {
            const time = helpers.getTime(json);
            if (json.file) {
              this.wrongLink(user.id);
              this.store.then(db => db.delete(user.id));
            } else if (user.watching) {
              this.build(user, json.buildStatus, json.last_build_number, json.last_build_id, time[0], time[1]);
            }
          });
      });
    }, 7000);
  }
}

export default { getJSON, jsonURL, getTime, cycle };
