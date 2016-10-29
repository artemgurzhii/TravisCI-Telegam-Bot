import getContent from './promiseRequest'

export default class GettingData {

  // slice message to get url for request, user id and repository
  // returns id, repository, url
  sliceMsg(msg) {
    const id = msg.slice(msg.lastIndexOf('org') + 4, msg.lastIndexOf('/'));
    const repository = msg.slice(msg.lastIndexOf('/'));

    return {
      id,
      repository,
      url: `https://api.travis-ci.org/repositories/${id}${repository}.json`
    };
  }

  request(url) {
    let currBuild;
    let prevBuild;

    getContent(url)
      .then(data => {
        let parsed = JSON.parse(data);
        currBuild = parsed.last_build_number;
        // if (prevBuild !== currBuild && parsed.last_build_finished_at) {
        if (true) {
          let link = `https://travis-ci.org/${parsed.slug}`;
          let start = parsed.last_build_started_at;
          let end = parsed.last_build_finished_at;
          let started = start.slice(start.indexOf('T') + 1, start.length - 1);
          let ended = end.slice(end.indexOf('T') + 1, end.length - 1);

          currBuild = parsed.last_build_number;
          prevBuild = parsed.last_build_number;
          return `Hi, your build at ${link} repository just has ended. \nYour build ${parsed.last_build_status === 0 ? 'completed successfully' : 'failed'}. \nBuild number was ${parsed.last_build_number}. \nYour build started at ${started} and finished at ${ended}. Link to build: ${link}/builds/${parsed.last_build_id}`;
        } else if (!parsed.last_build_finished_at) {
          prevBuild = parsed.last_build_number - 1;
          return 0;
        } else {
          return 0;
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
}
