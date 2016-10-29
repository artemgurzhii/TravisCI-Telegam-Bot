import GetData from '../services/index';
const initialize = new GetData();

let watching = true;

export default class Command {
  constructor() {}

  how(bot, message) {
    bot.sendMessage(message.from, "You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/twbs/bootstrap \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.");
  }

  link(bot, message, text) {
    bot.sendMessage(message.from, text);
  }

  start(bot, message) {
    watching = true;
    bot.sendMessage(message.from, "Ok, since now I will watch for changes.");
  }

  stop(bot, message) {
    watching = false;
    bot.sendMessage(message.from, "Ok, since now I'm stoping watching for changes.");
  }

  data(bot, message, url) {

    setInterval(() => {
      let data;
      initialize.req(url, res => {
        data = res;

        if (watching && data) {
          bot.sendMessage(message.from, data);
        }
      });
    }, 7000);

    bot.sendMessage(message.from, "Ok, since now I will watch for changes.");
  }

}
