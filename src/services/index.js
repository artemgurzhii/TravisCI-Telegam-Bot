import https from 'https';

/**
 * Set url for request, msg to slice to get id and repository name and build numbers.
 * @class
 * @classdesc All functions relates to receiving data from travis .json file
 */
export default class Data {

  /**
   * @param {string} msg - Message received from user.
   * @param {string} url - Url received from user.
   */
  constructor(msg, url = null) {
    this.msg = msg;
    this.url = url;
    this.currBuild = 0;
    this.prevBuild = 0;
  }

  /**
   * Slice received message to get id and repository names.
   * @return {Object} User id, repository and url for request.
   */
	sliceMsg() {
		const id = /\.org\/([^\s]+)\//.exec(this.msg)[1];
		const repository = /.+\/([^\s]+)/.exec(this.msg)[1];

		return {
			id,
			repository,
			url: `https://api.travis-ci.org/repositories/${id}/${repository}.json`
		};
	}

	/**
	 * Make request for .json file and return data from it.
	 * @param {function} cb Callback function to execute, when request is done.
	 */
	req(cb) {

		https.get(this.url, res => {
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

        /**
      	 * If url request dosn't return any data.
      	 * It is going to have 'file' property.
      	 */
				if (parsed.file) {
					cb('You have send invalid link, please send valid link', false);
				}

				// If build variables has initiale value reassign them to the current build value.
				if (this.prevBuild === 0 && this.currBuild === 0) {
					this.currBuild = this.prevBuild = parsed.last_build_number;
				}

        /**
      	 * If new build has ended - send message.
         * Get stated at and ended at time.
         * Reassign build variables.
      	 */
				if (this.prevBuild !== this.currBuild && parsed.last_build_finished_at) {

					// Link address
					const link = `https://travis-ci.org/${parsed.slug}`;

					// Message variables, build: started, ended
					const started = /T(.+)Z/.exec(parsed.last_build_started_at)[1];
					const ended = /T(.+)Z/.exec(parsed.last_build_finished_at)[1];

					// Reassigning build variables
					this.currBuild = parsed.last_build_number;
					this.prevBuild = parsed.last_build_number;

					// Callback function
					cb(`Hi, your build at ${link} repository just has ended. \nYour build ${parsed.last_build_status === 0 ? 'completed successfully' : 'failed'}. \nBuild number was ${parsed.last_build_number}. \nYour build started at ${started} and finished at ${ended}. Link to build: ${link}/builds/${parsed.last_build_id}`, true);
				} else if (!parsed.last_build_finished_at) {

					// If build is currently running
					this.prevBuild = parsed.last_build_number - 1;
				}
			});
		}).end();
	}
}
