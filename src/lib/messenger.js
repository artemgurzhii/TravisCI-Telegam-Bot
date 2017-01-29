import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import UserInput from './input';
import Commands from '../handlers';
import sliceMsg from '../utils/sliceMessage';
import store from '../db';

/**
 * Initialize bot.
 * @class
 * @classdesc Listen and respond to received messages.
 */
export default class Messenger {

	/**
	 * Set this.bot to new TelegramBot().
	 */
	constructor() {
		this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
			polling: true
		});
	}

	/**
	 * Listen for messages and fire response function on new message.
	 */
	listen() {
		this.bot.on('text', this.handleText.bind(this));
		return Promise.resolve();
	}

	/**
	 * Fired when message is received.
	 * @param {Object} msg - Object containing info about sender(message text and user id).
	 * @return {Function} Return function call depending on the received messag.
	 */
	handleText(msg) {
		/**
		 * Format the message.
		 * Getting message sender and user id stored in message variable.
		 * Initializing input(received message) and output(message to send, depends on input).
		 */
		const message = new Message(Message.mapMessage(msg));
		const text = message.text;
		const input = new UserInput(text);
		const output = new Commands(this.bot, message);

		// '/start' message is received.
		if (input.start()) {
			return output.start();
		}

		// '/how' message is received.
		if (input.isHelp()) {
			return output.help();
		}

		/**
		 * If '/link' message is received.
		 * Send link if it exist in db, else send message, that no links are being watched.
		 * @return {undefined} Send message to user.
		 */
		if (input.isLink()) {
			store()
				.then(value => {

					value
						.selectURL(message.from)
						.then(value => {
							if (!!value[0]) {
								output.link(value[0].url);
							} else {
								output.default('You have no watched links');
							}
						});
				});
			return;
		}

		/**
		 * If '/start_watching' message is received.
		 * @return {Promise} Send message to user.
		 */
		if (input.isStart()) {
			return output.startWatching();
		}

		/**
		 * If '/stop_watching' message is received.
		 * @return {Promise} Send message to user.
		 */
		if (input.isStop()) {
			return output.stopWatching();
		}

		/**
		 * Checking if user send valid travis-ci link
		 * @return {Promise} Send message to user.
		 */
		if (input.isValidLink()) {
			const json = sliceMsg(text);
			store()
        .then(database => database.selectURL(message.from))
				.then(url => {
					store()
						.then(database => {
							if (url[0] && url[0].url) {
								database.update(message.from, text, json);
							} else {
								database.insert(message.from, text, json);
							}
							return database;
						})
            .then(value => value.selectAll())
            .then(users => {
							users.forEach(user => {
								output.data(user);
							});
						});
				});
		} else {
			// If unknown message/command was received
			return output.unknown();
		}
	}
}
