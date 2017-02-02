/**
 * Set received message text and sender id.
 * @class
 * @classdesc Class representing a message received from user.
 */
export default class Message {

  /**
   * Get sender id message text.
   * @param {Object} message - Get user message object, with text and sender id properties.
   */
	constructor(message) {
		[this.from, this.text] = [message.from, message.text];
	}

  /**
   * @static
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
