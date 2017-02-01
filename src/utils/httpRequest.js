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

      // invalid url
      if (parsed.file) {
      }

      /**
       * If new build has ended - send message.
       * Get stated at and ended at time.
       * Reassign build variables.
       */
      currBuild = parsed.last_build_number;
      if (prevBuild !== currBuild && parsed.last_build_finished_at) {

        // Reassigning build variables
        currBuild = parsed.last_build_number;
        prevBuild = parsed.last_build_number;
      }
    });
  }).end();
}
