import request from 'requisition';
import store from '../db';
const db = new store();

/**
 * Get JSON data from the requested url.
 * @param {String} url - Url for request.
 * @return {Object} JSON Object with data from the last build.
 */
async function getJSON(url) {
  const res = await request(url);
  const body = await res.json();

  return body;
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

let interval;

function clear() {
  clearInterval(interval);
}

function cycle(users, output) {
  interval = setInterval(() => {
    users.forEach(user => {
      if (user.watchonlyfailing === undefined) {
        db.then(store => store.buildsToNotify(user.id, false))
      }
      getJSON(user.json).then(json => {
        db
          .then(store => store.selectBuild(user.id))
          .then(buildNumber => {

          // make sure user is watching
          // and new build exist
          if (
            user.watching &&
            buildNumber[0].build !== json.last_build_number
          ) {

            // send all messages if user watching for all builds
            // or only fail messages
            if (
              user.watchonlyfailing === false ||
              (user.watchonlyfailing === true &&
              json.last_build_status !== 0)
            ) {
              output.build(user, json, getTime(json));
              db.then(store => {
                store.updateBuild(user.id, json.last_build_number);
              });
            }
          };
        });
      });
    });
  }, 7000);
}

export default { getJSON, jsonURL, getTime, cycle, clear };
