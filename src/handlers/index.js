import Data from '../services';

let watching = true;

/** Class representing all commands available to user. */
export default class Command {

	constructor(bot, message) {
    this.bot = bot;
    this.message = message;
  }

  // Respond to '/how' command
	how() {
		this.bot.sendMessage(this.message.from, 'You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/emberjs/ember.js \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.');
	}

  // Respond to '/link' command
	link(text) {
		this.bot.sendMessage(this.message.from, text);
	}

  // Respond to '/start' command
	start() {
		watching = true;
		this.bot.sendMessage(this.message.from, 'Ok, since now I will watch for changes.');
	}

  // Respond to '/stop' command
	stop() {
		watching = false;
		this.bot.sendMessage(this.message.from, 'Ok, since now Im stoping watching for changes.');
	}

  // Make request each 7 seconds to get data.
	data(url) {
    const request = new Data(null, url);
		let interval = setInterval(() => {
			let data;
			request.req((res, valid) => {
				data = res;

				if (watching && data) {
					if (!valid) {
						clearInterval(interval);
					}
					this.bot.sendMessage(this.message.from, data);
				}
			});
		}, 7000);

		this.bot.sendMessage(this.message.from, 'Ok, since now I will watch for changes.');
	}

}
