import https from "https";

let currBuild = 0;
let prevBuild = 0;

export default class GettingData {

	/**
	 * Function accept string as argument, and return user id, repository and url for request.
	 *
	 * @param {string} msg String to slice.
	 */
	sliceMsg(msg) {
		const id = msg.slice(msg.lastIndexOf("org") + 4, msg.lastIndexOf("/"));
		const repository = msg.slice(msg.lastIndexOf("/") + 1);

		return {
			id,
			repository,
			url: `https://api.travis-ci.org/repositories/${id}/${repository}.json`
		};
	}

	/**
	 * Make request for .json file and return data from it.
	 *
	 * @param {string} url URL for https request.
	 * @param {function} cb Callback function to execute, when request is done.
	 */
	req(url, cb) {
		https.get(url, res => {
			let str = "";
			res.on("data", data => {
				str += data;
			});
			res.on("end", () => {
				const parsed = JSON.parse(str);

				// If url request dosn't return any data
				if (parsed.file) {
					cb("You have send invalid link, please send valid link", false);
				}

				currBuild = parsed.last_build_number;

				// If build variables wasn't set and had initiale value
				if (prevBuild === 0 && currBuild === 0) {
					prevBuild = parsed.last_build_number;
					currBuild = prevBuild;
				}

				// If new build were ended
				if (prevBuild !== currBuild && parsed.last_build_finished_at) {

					// Link address
					const link = `https://travis-ci.org/${parsed.slug}`;

					// Message variables, build: started, ended and etc
					const start = parsed.last_build_started_at;
					const end = parsed.last_build_finished_at;
					const started = start.slice(start.indexOf("T") + 1, start.length - 1);
					const ended = end.slice(end.indexOf("T") + 1, end.length - 1);

					// Reassigning build variables
					currBuild = parsed.last_build_number;
					prevBuild = parsed.last_build_number;

					// Callback function
					cb(`Hi, your build at ${link} repository just has ended. \nYour build ${parsed.last_build_status === 0 ? "completed successfully" : "failed"}. \nBuild number was ${parsed.last_build_number}. \nYour build started at ${started} and finished at ${ended}. Link to build: ${link}/builds/${parsed.last_build_id}`, true);
				} else if (!parsed.last_build_finished_at) {

					// If build is currently running
					prevBuild = parsed.last_build_number - 1;
				}
			});
		}).end();
	}
}
