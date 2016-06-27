"use strict";

var _nodeTelegramBotApi = require("node-telegram-bot-api");

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _package = require("./package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// importing https to make requests to travis json user data

var token = "227706347:AAF-Iq5fV8L4JYdk3g5wcU-z1eK1dd4sKa0"; // authorization token
// importing telegram bot node api
var travis = "https://travis-ci.org"; // using for getting json data and slicing strings
var bot = new _nodeTelegramBotApi2.default(token, { polling: true }); // initializing new bot
var opts = { // keyboard options
  reply_markup: {
    "keyboard": [["Yes"], ["No"]],
    one_time_keyboard: true // keyboard will shown only once and when it"s required
  }
};

var app = (0, _express2.default)();

app.get("/", function (req, res) {
  res.json({ version: _package.version });
});

var server = app.listen(process.env.PORT, function () {
  console.log("Web server started at http://%s:%s", server.address().address, server.address().port);
});

bot.on("text", function (msg) {
  // when user sending message
  var chatID = msg.chat.id; // saving user chat id from who bot received message
  var msgText = msg.text; // getting text content
  var userID = void 0; // need to have this values in global scope
  var userRepo = void 0; // need to have this values in global scope
  var options = void 0; // options for http request json data
  var prevBuild = void 0; // storing number of previous build
  var currBuild = void 0; // storing number of current build
  var currLink = void 0; // storing here name of current link
  var linkMessage = void 0; // text message on /link command
  var slicing = void 0; // using this variables for slicing user msg link
  var slicedLink = void 0; // using this variables for slicing user msg link

  // Send Message from bot function
  var botSendMsg = function botSendMsg(text, response) {
    // Function takes two arguments, bot command, and bot response
    msgText === text ? bot.sendMessage(chatID, response) : false;
  };

  // Function for getting JSON data file for user repository
  var getTravisData = function getTravisData() {
    if (msgText.indexOf(" ") > -1) {
      if (msgText.indexOf("https") > -1) {
        slicing = msgText.slice(msgText.indexOf("https"), msgText.indexOf(" ", msgText.lastIndexOf("/")));
        slicedLink = slicing.replace(/\s/g, "");
      } else {
        slicing = msgText.slice(msgText.indexOf("travis"), msgText.indexOf(" ", msgText.lastIndexOf("/")));
        slicedLink = slicing.replace(/\s/g, "");
      }
    } else {
      slicedLink = msgText;
    }

    userID = slicedLink.slice(slicedLink.lastIndexOf("org") + 4, slicedLink.lastIndexOf("/")); // getting user id
    userRepo = slicedLink.slice(slicedLink.lastIndexOf("/")); // getting user repository name

    // setting options for requested JSON file
    options = {
      host: "api.travis-ci.org",
      path: "/repositories/" + userID + userRepo + ".json",
      method: "GET",
      headers: {
        "User-Agent": userID
      }
    };

    // making request to user travis link to get current build status
    var request = _https2.default.request(options, function (response) {
      var str = "";

      response.on("data", function (data) {
        str += data;
      });
      response.on("end", function () {
        var parsed = JSON.parse(str); // parsing received data
        prevBuild = parsed.last_build_number; // ssigning previous build number to prevBuild
        currBuild = prevBuild; // assign it to prevBuild
        if (parsed.file) {
          // parsed.file is shown if reposotiry where request where made doesn"t exist
          bot.sendMessage(chatID, "" + commands.messages.invalidLink);
        } else {
          bot.sendMessage(chatID, commands.messages.validLink + " " + slicedLink);
        }
      });
    });
    request.end();
  };

  var httpIntervalRequest = function httpIntervalRequest() {
    // creating function which will be called when user sends travis link
    setInterval(function () {
      // creating setInterval to make http request each 7 seconds
      _https2.default.request(options, function (response) {
        // defining options
        var str = ""; // creating string where all json will be stored
        response.on("data", function (data) {
          // while getting data
          str += data; // pass data to string
        });
        response.on("end", function () {
          // when request is done
          var parsed = JSON.parse(str); // parsing JSON data
          currBuild = parsed.last_build_number; // assigning current build number
          if (prevBuild !== currBuild && parsed.last_build_finished_at) {
            // if prevBuild !== currBuild and build done

            var buildText = parsed.last_build_status === 0 ? "completed successfully" : "failed"; // defining if build failed or passed
            var buildNumber = parsed.last_build_number; // geting build number
            var repoName = parsed.slug.slice(parsed.slug.indexOf("/") + 1); // name of repository
            var startedAt = parsed.last_build_started_at; // when build was started
            var finishedAt = parsed.last_build_finished_at; // when build was ended
            var buildStarted = startedAt.slice(startedAt.indexOf("T") + 1, startedAt.length - 1); // getting pure date
            var buildFinished = finishedAt.slice(finishedAt.indexOf("T") + 1, finishedAt.length - 1); // getting pure date

            bot.sendMessage(chatID, "Hi, your build at " + repoName + " repository just has ended. \nYour build " + buildText + ". \nBuild number was " + buildNumber + ". \nYour build started at " + buildStarted + " and finished at " + buildFinished);

            currBuild = parsed.last_build_number; // reassign new variables
            prevBuild = parsed.last_build_number; // reassign new variables
          } else if (!parsed.last_build_finished_at) {
              // if user send link during build
              prevBuild = parsed.last_build_number - 1; // assign prevBuild number to currBuildNumber - 1
            }
        });
      }).end();
    }, 7000);
  };

  // Check if user send Travis Repository link
  var checkLink = msgText.indexOf(travis) > -1 || msgText.indexOf(travis.slice(8)) > -1;
  if (checkLink) {
    getTravisData();
    httpIntervalRequest();
  };

  if (slicedLink) {
    linkMessage = "Hi, your link is " + slicedLink;
    slicedLink = slicedLink;
  } else {
    linkMessage = "Hi, you have no watched links. Send me your link and I will start watching for you changes and will notify you each time when your build is done.";
  }

  var commands = {
    how: {
      commandName: "/how",
      commandText: "how does it work",
      msgText: "You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/twbs/bootstrap \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user."
    },
    link: {
      commandName: "/link",
      commandText: "get the currently watched link",
      msgText: linkMessage
    },
    start: {
      commandName: "/start",
      commandText: "get main description of what this bot can do",
      msgText: "Hi, I\"m @TravisCI_Telegam_Bot. Just send me link to Travis CI repository and I will notify you each time when your build is done."
    },
    messages: {
      invalidLink: "It\"s look like you send invalid link. Please send valid link.",
      validLink: "Ok, since now I will watch for changes in"
    }
  };

  botSendMsg("" + commands.how.commandName, "" + commands.how.msgText);
  botSendMsg("" + commands.link.commandName, "" + commands.link.msgText);
  botSendMsg("" + commands.start.commandName, commands.start.msgText + "\n\n    " + commands.how.commandName + " - " + commands.how.commandText + "\n    " + commands.link.commandName + " - " + commands.link.commandText + "\n    " + commands.start.commandName + " - " + commands.start.commandText + "\n  ");
});
