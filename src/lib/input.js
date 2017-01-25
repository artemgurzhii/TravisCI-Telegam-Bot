/** Class representing users message respond methods. */
export default class UserInput {

  /**
   * Used to check user message and decide how to respond.
   * @param {string} message - received message from the user.
   */
  constructor(message) {
    this.message = message;
  }

  /**
   * @return {boolean} If received message is '/how'.
   */
	isHow() {
		return this.message === '/how';
	}

  /**
   * @return {boolean} If received message is '/link'.
   */
	isLink() {
    return this.message === '/link';
	}

  /**
   * @return {boolean} If received message is '/start'.
   */
	isStart() {
    return this.message === '/start';
	}

  /**
   * @return {boolean} If received message is '/stop'.
   */
	isStop() {
    return this.message === '/stop';
	}

  /**
   * @return {boolean} If received message includes valid Travis-CI link.
   */
	isValidLink() {
		return /https:\/\/travis-ci\.org\/\S+\/\S+$/.test(this.message);
	}

}
