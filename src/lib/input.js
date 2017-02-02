/**
 * Received message.
 * @class
 * @classdesc Class representing users message respond methods.
 */
export default class Input {

  /**
   * Used to check user message and decide how to respond.
   * @param {String} message - received message from the user.
   */
  constructor(message) {
    this.message = message;
  }

  /**
   * @return {Boolean} If received message is '/start'.
   */
	start() {
		return this.message === '/start';
	}

  /**
   * @return {Boolean} If received message is '/how'.
   */
	isHelp() {
		return this.message === '/help';
	}

  /**
   * @return {Boolean} If received message is '/link'.
   */
	isLink() {
    return this.message === '/link';
	}

  /**
   * @return {Boolean} If received message is '/start_watching'.
   */
	isStart() {
    return this.message === '/start_watching';
	}

  /**
   * @return {Boolean} If received message is '/stop_watching'.
   */
	isStop() {
    return this.message === '/stop_watching';
	}

  /**
   * @return {Boolean} If received message includes valid Travis-CI link.
   */
	isValidLink() {
		return /https:\/\/travis-ci\.org\/\S+\/\S+$/.test(this.message);
	}
}
