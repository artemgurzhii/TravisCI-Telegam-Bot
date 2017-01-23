/** Class representing a Message. */
export default class Message {

  /**
   * Create a message.
   * @param {Object} msg - Geting user message text, id and info.
   */
	constructor(msg) {
		[this.from, this.text] = [msg.from, msg.text];
	}

  /**
   * @param {Object} msg - Object representing chat with user.
   * @return {Object} msg - From who message received, and message text.
   */
	static mapMessage(msg) {
		return {
			from: msg.from.id,
			text: msg.text
		};
	}

}
