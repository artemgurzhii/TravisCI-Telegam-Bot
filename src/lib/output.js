import store from '../db';
import helpers from '../utils/helpers';

/**
 * Set received message from user, bot and wathcing state.
 * @class
 * @classdesc Class representing all commands available to user.
 */
export default class Output {

  /**
   * Used to check user message and decide how to respond.
   * @param {Object} bot - Bot object.
   * @param {string} message - Received message from the user.
   */
	constructor(bot, message) {
    this.bot = bot;
    this.message = message;
    this.store = store();
  }

  /**
   * Respond to '/link' command.
   * @param {string} url - current link, which user is watching.
   * @return {Promise} Send message to user.
   */
	link(url) {
		return this.bot.sendMessage(this.message.from, url);
	}

  /**
   * Respond with passed argument.
   * @param {string} message - Message to send.
   * @return {Promise} Send message to user.
   */
  default(message) {
    return this.bot.sendMessage(this.message.from, message);
  }

  /**
   * Respond to all other messages.
   * When unknown message is received.
   * @return {Promise} Send message to user.
   */
  unknown() {
    return this.bot.sendMessage(this.message.from, 'Unknown command.');
  }

  /**
   * Respond to all other messages.
   * When unknown message is received.
   * @return {Promise} Send message to user.
   */
  watch(id) {
    return this.bot.sendMessage(id, 'Ok, since now I will watch for changes.');
  }

  /**
   * When invalid url was received.
   * @param {number} id - USer id to whom send message.
   * @return {Promise} Send message to user.
   */
  wrongLink(id) {
    return this.bot.sendMessage(id, 'Please send valid link. Example: https://travis-ci.org/emberjs/ember.js');
  }

  /**
   * Respond to '/{start,stop}_watching' command.
   * Change watching state to stop/start.
   * @param {string} state - State to which change.
   * @return {Promise} Send message to user.
   */
	changeWatchingState(state) {
		return this.bot.sendMessage(
      this.message.from,
      `Ok, since now I will ${state} watching for changes.`,
    );
	}

  /**
   * Respond to '/start' command.
   * @return {Promise} Send message to user.
   */
  start() {
    return this.bot.sendMessage(
      this.message.from,
      'Hi, my nams is @TravisCI_Telegam_Bot. I will notify you each time when your TravisCI build is done. Type /help to get more info or send TravisCI link to your repository to get started.'
    );
  }

  /**
   * Respond to '/how' command.
   * @return {Promise} Send message to user.
   */
  help() {
    return this.bot.sendMessage(
      this.message.from,
`You send me your Tavis CI repository link. Example:
https://travis-ci.org/emberjs/ember.js
Then I will watch for changes and will notify you each time when your build is done.

I will also include some basic information about your build.
Currently i can watch only one repository from each user.`
    );
  }

  build(user, json, time) {
    const status = json.buildStatus === 0 ? 'completed successfully' : 'failed';
    return this.bot.sendMessage(user.id, `
Hi, your build at ${user.url} repository just has ended.
Your build ${status}.
Build number was ${json.last_build_number}.
Your build started at ${time[0]} and finished at ${time[1]}. Link to build: ${user.url}/builds/${json.last_build_id}`);
  }

  /**
   * Respond with message that bot is watching for changes.
   * Make request each 10 seconds to get data.
   * Send request for each user url.
   * Argument contains users links to watch, links to json file and chat id.
   * Is user has sent invalid link, delete record.
   * @param {Array} user - received JSON formatted array of data.
   * @param {Boolean} bool - If 'watching' message should be sended.
   */
  data(users, bool) {
    helpers.clear();
    helpers.cycle(users, this);
    if (bool) {
      this.watch(this.message.from);
    }
  }
}
