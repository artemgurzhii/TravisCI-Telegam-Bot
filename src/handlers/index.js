import GetData from "../services/index";
const initialize = new GetData();

let watching = true;

/** Class representing all commands available to user. */
export default class Command {

	constructor() {}

  /**
   * Respond to '/how' command
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   */
	how(bot, message) {
		bot.sendMessage(message.from, "You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/emberjs/ember.js \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.");
	}

  /**
   * Respond to '/link' command
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   * @param {String} url URL For HTTPS request.
   */
	link(bot, message, text) {
		bot.sendMessage(message.from, text);
	}

  /**
   * Respond to '/start' command
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   */
	start(bot, message) {
		watching = true;
		bot.sendMessage(message.from, "Ok, since now I will watch for changes.");
	}

  /**
   * Respond to '/stop' command
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   */
	stop(bot, message) {
		watching = false;
		bot.sendMessage(message.from, "Ok, since now I'm stoping watching for changes.");
	}

  /**
   * Make request each 7 seconds to get data.
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   * @param {String} url URL For HTTPS request.
   */
	data(bot, msg, url) {

		let interval = setInterval(() => {
			let data;
			initialize.req(url, (res, valid) => {
				data = res;

				if (watching && data) {
					if (!valid) {
						clearInterval(interval);
					}
					bot.sendMessage(msg.from, data);
				}
			});
		}, 7000);

		bot.sendMessage(msg.from, "Ok, since now I will watch for changes.");
	}

}
