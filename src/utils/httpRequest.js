import request from 'request-promise';

// function httpRequest(url, cb) {
//   if (parsed.file) {
//     cb('Please send valid link. Example: https://travis-ci.org/emberjs/ember.js', false);
//   }
//
//   if (prevBuild === 0 && currBuild === 0) {
//     currBuild = parsed.last_build_number;
//     prevBuild = currBuild - 1;
//   } else {
//     currBuild = parsed.last_build_number;
//   }
//
//   if (prevBuild !== currBuild && parsed.last_build_finished_at) {
//
//     // Link address
//     const link = `https://travis-ci.org/${parsed.slug}`;
//
//     // Message variables, build: started, ended
//     const started = /T(.+)Z/.exec(parsed.last_build_started_at)[1];
//     const ended = /T(.+)Z/.exec(parsed.last_build_finished_at)[1];
//
//     // Reassigning build variables
//     currBuild = parsed.last_build_number;
//     prevBuild = parsed.last_build_number;
//     console.log(currBuild, prevBuild);
//
//     cb(`Hi, your build at ${link} repository just has ended. \nYour build ${parsed.last_build_status === 0 ? 'completed successfully' : 'failed'}. \nBuild number was ${parsed.last_build_number}. \nYour build started at ${started} and finished at ${ended}. Link to build: ${link}/builds/${parsed.last_build_id}`, true);
//   } else if (!parsed.last_build_finished_at) {
//
//     // If build is currently running
//     prevBuild = parsed.last_build_number - 1;
//   }
// }


export default class Request {
  constructor() {
    this.currBuild = 0;
    this.prevBuild = 0;
    this.parsed = undefined;
  }

  async getJSON(url) {
    const body = await request.get(url);
    const parsed = JSON.parse(body);
    this.parsed = parsed;
    return parsed;
  }

  time() {
    const started = /T(.+)Z/.exec(this.parsed.last_build_started_at)[1];
    const ended = /T(.+)Z/.exec(this.parsed.last_build_finished_at)[1];
    return [started, ended];
  }
}

// function httpRequest(url, cb) {
//   // If build variables has initiale value reassign them to the current build value.
//   if (prevBuild === 0 && currBuild === 0) {
//     currBuild = parsed.last_build_number;
//     prevBuild = currBuild - 1;
//   } else {
//     currBuild = parsed.last_build_number;
//   }
//
//   if (prevBuild !== currBuild && parsed.last_build_finished_at) {
//
//
//     // Reassigning build variables
//     currBuild = parsed.last_build_number;
//     prevBuild = parsed.last_build_number;
//   } else if (!parsed.last_build_finished_at) {
//     prevBuild = parsed.last_build_number - 1;
//   }
// }
