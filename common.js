// Requiing modules
import telegram from 'node-telegram-bot-api'; // telegram bot node api
import https from 'https';                    // make requests to travis json user data

// Telegram bot initialization
const token = '227706347:AAF-Iq5fV8L4JYdk3g5wcU-z1eK1dd4sKa0'; // authorization token
let bot = new telegram(token, {polling: true});                // initializing new bot

// main function to execute when getting message fom user
bot.on('text', msg => {

  const commands = {
    how: {
      commandName: '/how',
      commandText: 'how does it work',
      msgText: 'You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/twbs/bootstrap \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.'
    },
    link: {
      commandName: '/link',
      commandText: 'get the currently watched link',
      msgText: linkMessage
    },
    start: {
      commandName: '/start',
      commandText: 'get main description of what this bot can do',
      msgText: 'Hi, I\'m @TravisCI_Telegam_Bot. Just send me link to Travis CI repository and I will notify you each time when your build is done.'
    },
    stop: {
      commandName: '/stop',
      commandText: 'stops watching for current repository',
      msgText: `Ok, since now I'm stoping watching for changes in ${slicedLink}.`
    },
    messages: {
      invalidLink: "It's look like you send invalid link. Please send valid link.",
      validLink: `Ok, since now I will watch for changes in ${slicedLink}.`
    }
  };

  let chatID = msg.chat.id; // saving user chat id from who bot received message
  let msgText = msg.text;   // getting text content from message

  // variables to declare in global scope
  let userID;      // slice msg to get user ID
  let userRepo;    // slice msg to get user Repository name
  let options;     // options for http request json data
  let prevBuild;   // storing number of previous build
  let currBuild;   // storing number of current build
  let currLink;    // storing here name of current link
  let linkMessage; // text message on /link command
  let slicing;     // using this variables for slicing user msg link
  let slicedLink;  // using this variables for slicing user msg link

  // Function to send Message to user
  // It takes bot command and response as argumnets
  const send_message_by_bot = (text, response) => msgText === text ? bot.sendMessage(chatID, response) : false;

  // Function for getting JSON data file for user repository
  // This function will slice user msg if there any spaces, and other
  function getTravisData() {
    if (msgText.includes(' ')) {
      if (msgText.includes('https')) {
        slicing = msgText.slice(msgText.indexOf('https'), msgText.indexOf(' ', msgText.lastIndexOf('/')));
        slicedLink = slicing.replace(/\s/g, '');
      } else {
        slicing = msgText.slice(msgText.indexOf('travis'), msgText.indexOf(' ', msgText.lastIndexOf('/')));
        slicedLink = slicing.replace(/\s/g, '');
      }
    } else {
      slicedLink = msgText;
    }

    // slicing msg to get user ID and repository name
    userID = slicedLink.slice(slicedLink.lastIndexOf('org') + 4, slicedLink.lastIndexOf('/'));
    userRepo = slicedLink.slice(slicedLink.lastIndexOf('/'));

    // setting options for HTTP request JSON file
    options = {
      host: 'api.travis-ci.org',
      path: `/repositories/${userID}${userRepo}.json`,
      method: 'GET',
      headers: {
        'User-Agent': userID
      }
    };

    // Function to make http request to users travis api json file
    // to get current build info
    const request = https.request(options, response => {
      let str = '';

      response.on('data', data => {
        str += data;
      });
      response.on('end', () => {
        const parsed = JSON.parse(str);       // parsing received data
        prevBuild = parsed.last_build_number; // ssigning previous build number to prevBuild
        currBuild = prevBuild;                // assign it to prevBuild
        if (parsed.file) {                    // parsed.file is shown if reposotiry where request where made doesn't exist
          bot.sendMessage(chatID, commands.messages.invalidLink);
        } else {
          bot.sendMessage(chatID, commands.messages.validLink);
        }
      });
    });
    request.end();
  };

  // Function to make http request to users travis api json file, which will be called each 7 seconds
  // getting current build status and build number and storing them
  // when will making next http request it will compare current build status locally stored and in json file remotelly
  // and check if last build has ended
  // will send message to user with basic info about his build, like:

  // Hi, your build at ember.js repository just has ended.
  // Your build completed successfully.
  // Build number was 19444.
  // Your build started at 09:56:47 and finished at 10:05:39
  function httpIntervalRequest() {
    setInterval(() => {                    // creating setInterval to make http request each 7 seconds
      https.request(options, response => { // defining options
        let str = '';                      // creating string where all json will be stored
        response.on('data', data => {      // while getting data
          str += data;                     // pass data to string
        });
        response.on('end', () => {              // when request is done
          let parsed = JSON.parse(str);         // parsing JSON data
          currBuild = parsed.last_build_number; // assigning current build number
          if (prevBuild !== currBuild && parsed.last_build_finished_at) {  // if prevBuild !== currBuild and build done
            // bot.sendMessage(chatID, new Date().toLocaleString());
            let buildText = parsed.last_build_status === 0 ? 'completed successfully' : 'failed'; // defining if build failed or passed
            let buildNumber = parsed.last_build_number;                     // geting build number
            let startedAt = parsed.last_build_started_at;                   // when build was started
            let finishedAt = parsed.last_build_finished_at;                 // when build was ended
            let buildStarted = startedAt.slice(startedAt.indexOf('T') + 1, startedAt.length - 1);     // getting pure date
            let buildFinished = finishedAt.slice(finishedAt.indexOf('T') + 1, finishedAt.length - 1); // getting pure date

            bot.sendMessage(chatID, `Hi, your build at ${userRepo} repository just has ended. \nYour build ${buildText}. \nBuild number was ${buildNumber}. \nYour build started at ${buildStarted} and finished at ${buildFinished}`);

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
  const checkLink = msgText.includes('https://travis-ci.org') || msgText.includes('https://travis-ci.org'.slice(8));
  if (checkLink) {
    getTravisData();
    httpIntervalRequest();
  };

  if (slicedLink) {
    linkMessage = `Hi, your link is ${slicedLink}`;
    slicedLink = slicedLink;
  } else {
    linkMessage = 'Hi, you have no watched links. Send me your link and I will start watching for you changes and will notify you each time when your build is done.';
  }

  send_message_by_bot(`${commands.how.commandName}`, `${commands.how.msgText}`);
  send_message_by_bot(`${commands.how.commandName}`, `${commands.how.msgText}`);
  send_message_by_bot(`${commands.link.commandName}`, `${commands.link.msgText}`);
  send_message_by_bot(`${commands.start.commandName}`, `${commands.start.msgText}
  ${commands.how.commandName} - ${commands.how.commandText}
  ${commands.link.commandName} - ${commands.link.commandText}
  ${commands.start.commandName} - ${commands.start.commandText}`);
});

// TODO: Fix '/link' command. It should send curently watching link
// TODO: problem with not visiting link(website)
// TODO: add tests
// TODO: add '/stop' command

https.createServer(bot).listen(8000, () => console.log('Server running on http://0.0.0.0:8000'));
