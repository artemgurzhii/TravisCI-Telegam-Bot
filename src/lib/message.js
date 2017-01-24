/** Class representing a Message. */
export default class Message {

  /**
   * Create a message.
   * @param {Object} message - Geting user message text, id and info.
   */
	constructor(message) {
		[this.from, this.text] = [message.from, message.text];
	}

  /**
   * @param {Object} message - Chat data with user.
   * @return {Object} Message from who and chat id.
   */
	static mapMessage(message) {
		return {
			from: message.from.id,
			text: message.text
		};
	}

}
