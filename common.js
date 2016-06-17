'use strict';

var _nodeTelegramBotApi = require('node-telegram-bot-api');

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// importing https to make requests to travis json user data
var token = '227706347:AAF-Iq5fV8L4JYdk3g5wcU-z1eK1dd4sKa0'; // authorization token
// importing telegram bot node api
var bot = new _nodeTelegramBotApi2.default(token, { polling: true }); // initializing new bot
var opts = { // keyboard options
  reply_markup: {
    "keyboard": [["Yes"], ["No"]],
    one_time_keyboard: true // keyboard will shown only once and when it's required
  }
};

bot.on('text', function (msg) {
  // when user sending message
  var chatID = msg.chat.id; // Saving user chat id from who bot received message
  var msgText = msg.text; // Getting text content
  var travisLink = "https://travis-ci.org"; // Using for getting json data and slicing strings
  var userID = void 0; // need to have this values in global scope
  var userRepo = void 0; // need to have this values in global scope
  var options = void 0; // options for http request json data
  var prevBuiltNumber = void 0; // storing number of previous build
  var currBuiltNumber = void 0; // storing number of current build

  // Send Message from bot function
  var botSendMsg = function botSendMsg(text, response) {
    // Function takes two arguments, bot command, and bot response
    msgText === text ? bot.sendMessage(chatID, response) : false;
  };

  // Function for getting JSON data file for user repository
  var getTravisData = function getTravisData() {
    userID = msgText.slice(msgText.lastIndexOf('org') + 4, msgText.lastIndexOf('/')); // getting user id
    userRepo = msgText.slice(msgText.lastIndexOf('/')); // getting user repository name

    bot.sendMessage(chatID, 'Ok, ' + msgText + ' is that link you want to watch?', opts);
    // setting options for requested JSON file
    options = {
      host: 'api.travis-ci.org',
      path: '/repositories/' + userID + userRepo + '.json',
      method: 'GET',
      headers: {
        'User-Agent': userID
      }
    };

    // making request to user travis link to get current build status
    _https2.default.request(options, function (response) {
      var str = '';
      response.on('data', function (data) {
        str += data;
      });
      response.on('end', function () {
        var parsed = JSON.parse(str); // parsing received data
        prevBuiltNumber = parsed.last_build_number; // ssigning previous build number to prevBuiltNumber
        // checking if currBuiltNumber has value
        if (!!!currBuiltNumber) {
          // if it doesn't
          currBuiltNumber = prevBuiltNumber; // assign it to prevBuiltNumber
        }
      });
    }).end();
  };

  // creating function which will be called when user sends travis link
  var httpIntervalRequest = function httpIntervalRequest() {
    // creating setInterval to make http request each 7 seconds
    setInterval(function () {
      _https2.default.request(options, function (response) {
        var str = '';
        response.on('data', function (data) {
          str += data;
        });
        response.on('end', function () {
          var parsed = JSON.parse(str); // parsing JSON data
          currBuiltNumber = parsed.last_build_number; // assigning current build number to currBuiltNumber
          if (prevBuiltNumber !== currBuiltNumber && parsed.last_build_finished_at) {
            // if after assigning it's not same as prevBuiltNumber

            currBuiltNumber = parsed.last_build_number; // reassign new variables
            prevBuiltNumber = parsed.last_build_number; // reassign new variables

            var buildDoneText = parsed.last_build_status === 0 ? 'completed successfully' : 'failed';
            var buildNumber = parsed.last_build_number;
            var buildDuration = parsed.last_build_number;
            var minutes = Math.floor(buildDuration / 60);
            var seconds = buildDuration - minutes * 60;
            var repoName = parsed.slug.slice(parsed.slug.lastIndexOf('/') + 1);

            bot.sendMessage(chatID, '\n              Hi, your build at ' + repoName + ' repository just has ended. Your build ' + buildDoneText + '.\n              Build number was ' + buildNumber + ' and total time is ' + minutes + ':' + seconds + '\n            ');
          }
        });
      }).end();
    }, 7000);
  };

  // Check if user send Travis Repository link
  var checkLink = msgText.indexOf(travisLink) > -1 || msgText.indexOf(travisLink.slice(8)) > -1;
  if (checkLink) {
    getTravisData();
    httpIntervalRequest();
  }

  botSendMsg('/help', 'Hi, i\'m @TravisCI_Telegam_Bot. I will notify you each time when your Travis CI build is done. You can read more on https://github.com/artemgurzhii/TravisCI_Telegam_Bot.\n\nTo start please send me your Travis CI link.');
  botSendMsg('/how', 'You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/twbs/bootstrap \n\nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \n\nCurrently i can watch only one repository from each user.');
  botSendMsg('Yes', 'Ok, now I will start watching for changes. Since know I will notify you each time when your Travis CI build is done.');
  botSendMsg('No', 'Ok, than send me link you want to watch');
});
