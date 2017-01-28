/**
 * Slice received message to get id and repository names.
 * @return {Object} User id, repository and url for request.
 */
export default function sliceMsg(msg) {
  const id = /\.org\/([^\s]+)\//.exec(msg)[1];
  const repository = /.+\/([^\s]+)/.exec(msg)[1];

  return {
    id,
    repository,
    url: `https://api.travis-ci.org/repositories/${id}/${repository}.json`
  };
}
