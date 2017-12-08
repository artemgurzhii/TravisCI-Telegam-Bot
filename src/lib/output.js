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
    return this.bot.sendMessage(id, 'Ok. Starting now I will watch for changes.');
  }

  /**
   * When invalid url was received.
   * @param {number} id - User id to whom send message.
   * @return {Promise} Send message to user.
   */
  wrongLink(id) {
    return this.bot.sendMessage(id, 'Please send valid link. Example: https://travis-ci.org/emberjs/ember.js');
  }

  /**
   * About which builds to notify.
   * @param {builds} string - Builds to watch.
   * @return {Promise} Send message to user.
   */
  watchBuilds(builds = 'all') {
    return this.bot.sendMessage(this.message.from, `Ok. Starting now, I will notify you about ${builds} builds.`);
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
      `Ok. Starting now I will ${state} watching for changes.`,
    );
	}

  /**
   * Respond to '/start' command.
   * @return {Promise} Send message to user.
   */
  start() {
    return this.bot.sendMessage(
      this.message.from,
      'Hi, my name is @TravisCI_Telegam_Bot. I will notify you when your TravisCI build is done. Type /help to get more info or send TravisCI link to your repository to get started.'
    );
  }

  /**
   * Respond to '/how' command.
   * @return {Promise} Send message to user.
   */
  help() {
    return this.bot.sendMessage(
      this.message.from,
`You send me your Travis CI repository link. Example:
https://travis-ci.org/emberjs/ember.js
Then I will watch for changes and will notify you when your build is done.

I will also include some basic information about your build.
Currently I can watch only one repository from each user.`
    );
  }

	build(user, json, time) {
		const buildStatus = json.last_build_status === 0;
		const status = buildStatus ? 'completed successfully' : 'failed';
		let statusBuildIcon = '✅';
		if (!buildStatus) {
			statusBuildIcon = '❌';
		}
		return this.bot.sendMessage(
			user.id,
			`${statusBuildIcon} Build #${json.last_build_number} ${status}

Started : ${time[0]}
Finished: ${time[1]}

➡️ [Link to build](${user.url}/builds/${json.last_build_id})
			`,
			{
				parse_mode: 'markdown'
			}
		);
	}

  /**
   * Clear previous interval and start new one.
   * Respond with message that bot is watching for changes.
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
