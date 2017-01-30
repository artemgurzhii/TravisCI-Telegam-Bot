import httpRequest from '../utils/httpRequest';
import store from '../db';

let latestUsers;
let intervalId;

/**
 * Set received message from user, bot and wathcing state.
 * @class
 * @classdesc Class representing all commands available to user.
 */
export default class Commands {

  /**
   * Used to check user message and decide how to respond.
   * @param {Object} bot - Bot object.
   * @param {string} message - Received message from the user.
   */
	constructor(bot, message) {
    this.bot = bot;
    this.message = message;
  }

  /**
   * Respond to '/start' command.
   * @return {Object} Send message to user.
   */
  start() {
    return this.bot.sendMessage(this.message.from, 'Hi, my nams is @TravisCI_Telegam_Bot. I will notify you each time when your TravisCI build is done. Type /help to get more info or send TravisCI link to your repository to get started.');
  }

  /**
   * Respond to '/how' command.
   * @return {Object} Send message to user.
   */
	help() {
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
   * Respond to '/start_watching' command.
   * Change watching state to true.
   * @return {Object} Send message to user.
   */
	startWatching() {
		return this.bot.sendMessage(this.message.from, 'Ok, since now I will watch for changes.');
	}

  /**
   * Respond to '/stop_watching' command.
   * Change watching state to false.
   * @return {Object} Send message to user.
   */
	stopWatching() {
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
   * When unknown message is received.
   * @return {Object} Send message to user.
   */
  unknown() {
    return this.bot.sendMessage(this.message.from, 'Unknown command.');
  }

  /**
   * Respond with message that bot is watching for changes.
   * Make request each 10 seconds to get data.
   * Send request for each user url.
   * Argument contains users links to watch, links to json file and chat id.
   * Is user has sent invalid link, delete record.
   * @param {Array} user - received JSON formatted array of data.
   */
  data(users) {
    latestUsers = users;

    if (!intervalId) {
      intervalId = setInterval(() => {
        latestUsers.forEach(user => {
          httpRequest(user.json, (res, valid) => {
            if (!valid) {
              store()
                .then(db => Promise.all([db, db.watchingState(user.id, false)]))
                .then(db => {
                  db.watchingState(user.id, false);
                  return db;
                })
                .then(db => db.delete(user.id));
            }
            if (user.watching) {
              this.bot.sendMessage(user.id, res);
            }
          });
        });
      }, 7000);
    }

    this.bot.sendMessage(this.message.from, 'Ok, since now I will watch for changes.');
  }
}
