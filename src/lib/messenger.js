import pg from 'pg';
import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import Config from '../config';
import UserInput from './input';
import Handlers from '../handlers';
import Data from '../services';

let link;

export default class Messenger {

	constructor() {
		this.bot = new TelegramBot(Config.telegram.token, {
			polling: true
		});
    this.handling = undefined;
	}

	listen() {
		this.bot.on('text', this.handleText.bind(this));
		return Promise.resolve();
	}

	handleText(msg) {
		// format the message
		const message = new Message(Message.mapMessage(msg));
		const text = message.text;
    const functions = new Data(text);
    const input = new UserInput(text);
    this.handling = new Handlers(this.bot, message);

		// if message is '/how'
		if (input.programHow()) {
			return this.handling.how();
		}

		// if message is '/link'
		if (input.programLink()) {
      if (link === undefined) {
        return this.handling.link('You have no watched links');
      }
      return this.handling.link(link);
		}

		// if message is '/start'
		if (input.programStart()) {
      if (link === undefined) {
        return this.handling.link('You have no watched links');
      }
			return this.handling.start();
		}

		// if message is '/stop'
		if (input.programStop()) {
      if (link === undefined) {
        return this.handling.link("You're not watching for any changes");
      }
			return this.handling.stop();
		}

		// checking if user send valid travis-ci link
		if (input.programValidLinkSended()) {
      const results = [];

      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        if (err) throw err;
        client.query(
          'INSERT INTO TravisCITelegamBot(id, link) values($1, $2) ON CONFLICT DO NOTHING',
         [message.from, message.text]
        );

        const query = client.query('SELECT * FROM TravisCITelegamBot');
        query.on('row', row => {
          results.push(row);
        });
        query.on('end', () => {
          done();
          console.log(results);
        });
      });

			link = text;
			const sliced = functions.sliceMsg(text);
			return this.handling.data(sliced.url);
		}

		// default - send message with help
		return this.handling.how();
	}
}
