import TelegramBot from 'node-telegram-bot-api';                // importing telegram bot node api
import https from 'https';                                      // importing https to make requests to travis json user data
import express from 'express';
import { version as packageInfo } from './package.json';
const token = '227706347:AAF-Iq5fV8L4JYdk3g5wcU-z1eK1dd4sKa0';  // authorization token
let bot = new TelegramBot(token, {polling: true});              // initializing new bot
const opts = {              // keyboard options
  reply_markup: {
    "keyboard": [
      ["Yes"],
      ["No"]
    ],
    one_time_keyboard: true // keyboard will shown only once and when it's required
  }
};

let app = express();

app.get('/', function (req, res) {
  res.json({ version: packageInfo });
});

let server = app.listen(process.env.PORT, () => {
  console.log('Web server started at http://%s:%s', server.address().address, server.address().port);
});


bot.on('text', msg => {                       // when user sending message
  const chatID = msg.chat.id;                 // Saving user chat id from who bot received message
  const msgText = msg.text;                   // Getting text content
  const travisLink = "https://travis-ci.org"; // Using for getting json data and slicing strings
  let userID;                                 // need to have this values in global scope
  let userRepo;                               // need to have this values in global scope
  let options;                                // options for http request json data
  let prevBuild;                              // storing number of previous build
  let currBuild;                              // storing number of current build
  let currLink;                               // storing here name of current link

  // Send Message from bot function
  const botSendMsg = (text, response) => {  // Function takes two arguments, bot command, and bot response
    msgText === text ? bot.sendMessage(chatID, response) : false;
  };

  // Function for getting JSON data file for user repository
  const getTravisData = () => {
    userID = msgText.slice(msgText.lastIndexOf('org') + 4, msgText.lastIndexOf('/')); // getting user id
    userRepo = msgText.slice(msgText.lastIndexOf('/'));                               // getting user repository name

    currLink = msgText;

    bot.sendMessage(chatID, `Ok, ${msgText} is that link you want to watch?`, opts);
    // setting options for requested JSON file
    options = {
      host: 'api.travis-ci.org',
      path: `/repositories/${userID}${userRepo}.json`,
      method: 'GET',
      headers: {
        'User-Agent': userID
      }
    };

    // making request to user travis link to get current build status
    https.request(options, response => {
      let str = '';
      response.on('data', data => {
        str += data;
      });
      response.on('end', () => {
        const parsed = JSON.parse(str);       // parsing received data
        prevBuild = parsed.last_build_number; // ssigning previous build number to prevBuild
        if (!(!!currBuild)) {                 // if currBuild doesn't have value
          currBuild = prevBuild;              // assign it to prevBuild
        }
      });
    }).end();
  };

  let httpIntervalRequest = () => {         // creating function which will be called when user sends travis link
    setInterval(() => {                     // creating setInterval to make http request each 7 seconds
      https.request(options, response => {  // defining options
        let str = '';                       // creating string where all json will be stored
        response.on('data', data => {       // while getting data
          str += data;                      // pass data to string
        });
        response.on('end', () => {              // when request is done
          const parsed = JSON.parse(str);       // parsing JSON data
          currBuild = parsed.last_build_number; // assigning current build number
          if (prevBuild !== currBuild && parsed.last_build_finished_at) {  // if prevBuild !== currBuild and build done

            let buildText = parsed.last_build_status === 0 ? 'completed successfully' : 'failed'; // defining if build failed or passed
            let buildNumber = parsed.last_build_number;                     // geting build number
            let repoName = parsed.slug.slice(parsed.slug.indexOf('/') + 1); // name of repository
            let startedAt = parsed.last_build_started_at;                   // when build was started
            let finishedAt = parsed.last_build_finished_at;                 // when build was ended
            let buildStarted = startedAt.slice(startedAt.indexOf('T') + 1, startedAt.length - 1);     // getting pure date
            let buildFinished = finishedAt.slice(finishedAt.indexOf('T') + 1, finishedAt.length - 1); // getting pure date

            bot.sendMessage(chatID, `Hi, your build at ${repoName} repository just has ended. \nYour build ${buildText}. \nBuild number was ${buildNumber}. \nYour build started at ${buildStarted} and finished at ${buildFinished}`);

            currBuild = parsed.last_build_number;   // reassign new variables
            prevBuild = parsed.last_build_number;   // reassign new variables

          } else if (!parsed.last_build_finished_at) {  // if user send link during build
            prevBuild = parsed.last_build_number - 1;   // assign prevBuild number to currBuildNumber - 1
          }
        });
      }).end();
    }, 7000);
  };

  // Check if user send Travis Repository link
  const checkLink = msgText.indexOf(travisLink) > -1 || msgText.indexOf(travisLink.slice(8)) > -1;
  if (checkLink) {
    getTravisData();
    httpIntervalRequest();
  };

  botSendMsg('/help', `Hi, i'm @TravisCI_Telegam_Bot. I will notify you each time when your Travis CI build is done. You can read more on https://github.com/artemgurzhii/TravisCI_Telegam_Bot.\n\nTo start please send me your Travis CI link.`);
  botSendMsg('/how', 'You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/twbs/bootstrap \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.');
  botSendMsg('Yes', 'Ok, now I will start watching for changes. Since know I will notify you each time when your Travis CI build is done.');
  botSendMsg('No', 'Ok, than send me link you want to watch');

  if (currLink === 'undefined') {
    botSendMsg('/link', `Hi, you have no watched links.`);
  } else {
    botSendMsg('/link', `Hi, your link is ${currLink}`);
  }

});
