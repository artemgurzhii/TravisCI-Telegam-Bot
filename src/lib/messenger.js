import pg from 'pg';
import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import Config from '../config';
import UserInput from './input';
import Commands from '../handlers';
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
    const input = new UserInput(text);
    const output = new Commands(this.bot, message);
    let link;

		// '/how' message is received.
		if (input.isHow()) {
			return output.how();
		}

		// '/link' message is received.
		if (input.isLink()) {
      let results = [];
      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        if (err) throw err;

        const query = client.query(
          'SELECT * FROM TravisCITelegamBot WHERE id=($1)',
          [message.from]
        );
        query.on('row', row => {
          results.push(row);
        });
        query.on('end', () => {
          if (!!results[0]) {
            output.link(results[0].url);
          } else {
            output.default('You have no watched links');
          }
          done();
        });
      });
      return;
		}

		// '/start' message is received.
		if (input.isStart()) {
			return output.start();
		}

		// '/stop' message is received.
		if (input.isStop()) {
			return output.stop();
		}

		// checking if user send valid travis-ci link
		if (input.isValidLink()) {
      const functions = new Data(text);
			const sliced = functions.sliceMsg(text);
      let results = [];
      link = text;

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
      });;
		}

    // return output.unknown();
	}
}
