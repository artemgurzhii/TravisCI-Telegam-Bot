export default class UserInput {

  /**
   * If message is '/how'
   *
   * @param {String} msg Message received from user.
   */
	programHow(msg) {
		return msg.match("/how");
	}

  /**
   * If message is '/link'
   *
   * @param {String} msg Message received from user.
   */
	programLink(msg) {
		return msg.match("/link");
	}

  /**
   * If message is '/start'
   *
   * @param {String} msg Message received from user.
   */
	programStart(msg) {
		return msg.match("/start");
	}

	// message is "'stop'
  /**
   * If message is '/stop'
   *
   * @param {String} msg Message received from user.
   */
	programStop(msg) {
		return msg.match("/stop");
	}

  /**
   * If user send valid Travis-CI link
   *
   * @param {String} msg Message received from user.
   */
	programValidLinkSended(msg) {
		return msg.match(/https:\/\/travis-ci\.org\/\S+\/\S+$/);
	}

}
