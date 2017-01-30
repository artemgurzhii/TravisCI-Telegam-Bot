import https from 'https';

/**
 * Make request for .json file and return data from it.
 * @param {string} url URL for request.
 * @param {function} cb Callback function to execute, when request is done.
 */
export default function httpRequest(url, cb) {

  let prevBuild = 0;
  let currBuild = 0;

  https.get(url, res => {
    let str = '';

    /**
     * ON data - Add data to string.
     * ON end - Parse json data.
     */
    res.on('data', data => {
      str += data;
    });
    res.on('end', () => {
      const parsed = JSON.parse(str);
      console.log(parsed);

      /**
       * If url request dosn't return any data.
       * It is going to have 'file' property.
       */
      if (parsed.file) {
        // Callback function
        cb('Please send valid link. Example: https://travis-ci.org/emberjs/ember.js', false);
      }

      // If build variables has initiale value reassign them to the current build value.
      if (prevBuild === 0 && currBuild === 0) {
        currBuild = prevBuild = parsed.last_build_number;
      }

      /**
       * If new build has ended - send message.
       * Get stated at and ended at time.
       * Reassign build variables.
       */
      if (prevBuild !== currBuild && parsed.last_build_finished_at) {

        // Link address
        const link = `https://travis-ci.org/${parsed.slug}`;

        // Message variables, build: started, ended
        const started = /T(.+)Z/.exec(parsed.last_build_started_at)[1];
        const ended = /T(.+)Z/.exec(parsed.last_build_finished_at)[1];

        // Reassigning build variables
        currBuild = parsed.last_build_number;
        prevBuild = parsed.last_build_number;

        // Callback function
        cb(`Hi, your build at ${link} repository just has ended. \nYour build ${parsed.last_build_status === 0 ? 'completed successfully' : 'failed'}. \nBuild number was ${parsed.last_build_number}. \nYour build started at ${started} and finished at ${ended}. Link to build: ${link}/builds/${parsed.last_build_id}`, true);
      } else if (!parsed.last_build_finished_at) {

        // If build is currently running
        prevBuild = parsed.last_build_number - 1;
      }
    });
  }).end();
}
