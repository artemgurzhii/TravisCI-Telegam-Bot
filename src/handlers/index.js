import Data from '../services';

/* Class representing all commands available to user. */
export default class Commands {

  /**
   * Used to check user message and decide how to respond.
   * @param {Object} bot - Bot object.
   * @param {*} bot.sendMessage - Function to send message from bot to user.
   * @param {string} message - Received message from the user.
   */
	constructor(bot, message) {
    this.bot = bot;
    this.message = message;
    this.watching = true;
  }

  /**
   * Respond to '/how' command.
   * @return {Object} Send message to user.
   */
	how() {
		return this.bot.sendMessage(this.message.from, 'You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/emberjs/ember.js \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.');
	}

  /**
   * Respond to '/link' command.
   * @param {string} url - current link, which user is watching.
   * @return {Object} Send message to user.
   */
	link(url) {
		return this.bot.sendMessage(this.message.from, url);
	}

  /**
   * Respond to '/start' command.
   * Change watching state to true.
   * @return {Object} Send message to user.
   */
	start() {
		this.watching = true;
		return this.bot.sendMessage(this.message.from, 'Ok, since now I will watch for changes.');
	}

  /**
   * Respond to '/stop' command.
   * Change watching state to false.
   * @return {Object} Send message to user.
   */
	stop() {
		this.watching = false;
		return this.bot.sendMessage(this.message.from, 'Ok, since now I will stop watching for changes.');
	}

  /**
   * Respond with passed argument.
   * @param {string} message - Message to send.
   * @return {Object} Send message to user.
   */
  default(message) {
    return this.bot.sendMessage(this.message.from, message);
  }

  /**
   * Respond to all other messages.
   * Unknown message where received.
   * @return {Object} Send message to user.
   */
  unknown() {
    return this.bot.sendMessage(this.message.from, 'Unknown command.');
  }

  /**
   * Make request each 10 seconds to get data.
   * Respond with message that bot is watching for changes.
   * If build is done, send message.
   * @param {Array} db - received JSON formatted array of data.
   * Contains users links to watch and where to send request.
   */
	data(db) {
    let request;
		let interval = setInterval(() => {
      db.forEach(user => {
        request = new Data(null, user.json);
        request.req((res, valid) => {
          if (this.watching && res) {
            if (!valid) {
              clearInterval(interval);
            }
            this.bot.sendMessage(user.id, res);
          }
        });
      });
		}, 1000);

		this.bot.sendMessage(this.message.from, 'Ok, since now I will watch for changes.');
	}

}
