import pg from 'pg';
import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import Config from '../config';
import UserInput from './input';
import Handlers from '../handlers';
import Data from '../services';

export default class Messenger {

	constructor() {
		this.bot = new TelegramBot(Config.telegram.token, {
			polling: true
		});
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
    const output = new Handlers(this.bot, message);
    let link;

		// '/how' message is received.
		if (input.isHow()) {
			return output.how();
		}

		// '/link' message is received.
		if (input.isLink()) {
      if (link === undefined) {
        return output.default('You have no watched links');
      }
      let results = [];
      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        if (err) throw err;

        const query = client.query(
          'SELECT url FROM TravisCITelegamBot WHERE id=($1)', [message.from]
        );
        query.on('row', row => {
          results.push(row);
        });
        query.on('end', () => {
          done();
          return output.link(results[0].url);
        });
      });
		}

		// '/start' message is received.
		if (input.isStart()) {
      if (link === undefined) {
        return output.default('You have no watched links');
      }
			return output.start();
		}

		// '/stop' message is received.
		if (input.isStop()) {
      if (link === undefined) {
        return output.default('You\'re not watching for any changes');
      }
			return output.stop();
		}

		// checking if user send valid travis-ci link
		if (input.isValidLink()) {
      let results = [];
      link = text;
			const sliced = functions.sliceMsg(text);

      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        if (err) throw err;

        client.query(
          'INSERT INTO TravisCITelegamBot(id, url, json) values($1, $2, $3) ON CONFLICT DO NOTHING',
          [message.from, link, sliced.url]
        );
        client.query(
          'UPDATE TravisCITelegamBot SET url=($2), json=($3) WHERE id=($1)',
          [message.from, link, sliced.url]
        );

        const query = client.query(
          'SELECT * FROM TravisCITelegamBot'
        );
        query.on('row', row => {
          results.push(row);
        });
        query.on('end', () => {
          done();
          return output.data(results);
        });
      });
		}
    return output.unknown();
	}
}
