'use strict';var _nodeTelegramBotApi=require('node-telegram-bot-api');var _nodeTelegramBotApi2=_interopRequireDefault(_nodeTelegramBotApi);var _https=require('https');var _https2=_interopRequireDefault(_https);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};} // Telegram bot initialization
// Requiring telegram node api and https modules
var token='227706347:AAF-Iq5fV8L4JYdk3g5wcU-z1eK1dd4sKa0'; // authorization token
var bot=new _nodeTelegramBotApi2.default(token,{polling:true}); // initializing new bot
// variables to declare in global scope
var userID=void 0; // slice msg to get user ID
var userRepo=void 0; // slice msg to get user Repository name
var options=void 0; // options for http request json data
var prevBuild=void 0; // storing number of previous build
var currBuild=void 0; // storing number of current build
var currLink=void 0; // storing here name of current link
var linkMessage=void 0; // text message on /link command
var slicing=void 0; // using this variables for slicing user msg link
var slicedLink=void 0; // using this variables for slicing user msg link
// main function to execute when getting message fom user
bot.on('text',function(msg){var chatID=msg.chat.id; // saving user chat id from who bot received message
var msgText=msg.text; // getting text content from message
// Send response to command if user message matching 'response' argument
var send_message_by_bot=function send_message_by_bot(text,response){return msgText===text?bot.sendMessage(chatID,response):false;}; // Slice passed argument as string from index of text, till end of line
function sliceFrom(msg,text){msg.slice(msg.indexOf(text),msg.indexOf(' ',msg.lastIndexOf('/')));slicedLink=slicing.replace(/\s/g,'');} // Slice user message to get correct travis.ci link
function getTravisData(){if(msgText.includes(' ')){if(msgText.includes('https')){sliceFrom(msgText,'https');}else {sliceFrom(msgText,'travis');}}else {slicedLink=msgText;} // slicing msg to get user ID and repository name
userID=slicedLink.slice(slicedLink.lastIndexOf('org')+4,slicedLink.lastIndexOf('/'));userRepo=slicedLink.slice(slicedLink.lastIndexOf('/')); // setting options for HTTP request JSON file
options={host:'api.travis-ci.org',path:'/repositories/'+userID+userRepo+'.json',method:'GET',headers:{'User-Agent':userID}}; // Function to make http request to users travis api json file
// to get current build info
var request=_https2.default.request(options,function(response){var str='';response.on('data',function(data){str+=data;});response.on('end',function(){var parsed=JSON.parse(str); // parsing received data
prevBuild=parsed.last_build_number; // ssigning previous build number to prevBuild
currBuild=prevBuild; // assign it to prevBuild
if(parsed.file){ // parsed.file is shown if reposotiry where request where made doesn't exist
bot.sendMessage(chatID,commands.messages.invalidLink);}else {bot.sendMessage(chatID,commands.messages.validLink);}});});request.end();};var commands={how:{commandName:'/how',commandText:'how does it work',msgText:'You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/twbs/bootstrap \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.'},link:{commandName:'/link',commandText:'get the currently watched link',msgText:linkMessage},start:{commandName:'/start',commandText:'get main description of what this bot can do',msgText:"Hi, I'm @TravisCI_Telegam_Bot. Just send me link to Travis CI repository and I will notify you each time when your build is done."},stop:{commandName:'/stop',commandText:'stops watching for current repository',msgText:"Ok, since now I'm stoping watching for changes."},messages:{invalidLink:"It's look like you send invalid link. Please send valid link.",validLink:'Ok, since now I will watch for changes.'}}; // Function to make http request to users travis api json file, which will be called each 7 seconds
// getting current build status and build number and storing them
// when will making next http request it will compare current build status locally stored and in json file remotelly
// and check if last build has ended
// will send message to user with basic info about his build, like:
// Hi, your build at ember.js repository just has ended.
// Your build completed successfully.
// Build number was 19444.
// Your build started at 09:56:47 and finished at 10:05:39
function httpIntervalRequest(){setInterval(function(){ // creating setInterval to make http request each 7 seconds
_https2.default.request(options,function(response){ // defining options
var str=''; // creating string where all json will be stored
response.on('data',function(data){ // while getting data
str+=data; // pass data to string
});response.on('end',function(){ // when request is done
var parsed=JSON.parse(str); // parsing JSON data
currBuild=parsed.last_build_number; // assigning current build number
if(prevBuild!==currBuild&&parsed.last_build_finished_at){ // if prevBuild !== currBuild and build done
// bot.sendMessage(chatID, new Date().toLocaleString());
var buildText=parsed.last_build_status===0?'completed successfully':'failed'; // defining if build failed or passed
var buildNumber=parsed.last_build_number; // geting build number
var buildID=parsed.last_build_id; // geting build id
var startedAt=parsed.last_build_started_at; // when build was started
var finishedAt=parsed.last_build_finished_at; // when build was ended
var buildStarted=startedAt.slice(startedAt.indexOf('T')+1,startedAt.length-1); // getting pure date
var buildFinished=finishedAt.slice(finishedAt.indexOf('T')+1,finishedAt.length-1); // getting pure date
bot.sendMessage(chatID,'Hi, your build at '+userRepo+' repository just has ended. \nYour build '+buildText+'. \nBuild number was '+buildNumber+'. \nYour build started at '+buildStarted+' and finished at '+buildFinished+'. Link to build: '+slicedLink+'/builds/'+buildID); // reassigning to a new variables
currBuild=parsed.last_build_number;prevBuild=parsed.last_build_number;}else if(!parsed.last_build_finished_at){ // if user send link during build
prevBuild=parsed.last_build_number-1; // assign prevBuild number to currBuildNumber - 1
}});}).end();},7000);}; // Check if user send Travis Repository link
var checkLink=msgText.includes('https://travis-ci.org')||msgText.includes('https://travis-ci.org'.slice(8));if(checkLink){getTravisData();httpIntervalRequest();};if(slicedLink){linkMessage='Hi, your link is '+slicedLink;slicedLink=slicedLink;}else {linkMessage='Hi, you have no watched links. Send me your link and I will start watching for you changes and will notify you each time when your build is done.';}send_message_by_bot(''+commands.how.commandName,''+commands.how.msgText);send_message_by_bot(''+commands.stop.commandName,''+commands.stop.msgText);send_message_by_bot(''+commands.link.commandName,''+commands.link.msgText);send_message_by_bot(''+commands.start.commandName,commands.start.msgText+'\n  '+commands.how.commandName+' - '+commands.how.commandText+'\n  '+commands.link.commandName+' - '+commands.link.commandText+'\n  '+commands.start.commandName+' - '+commands.start.commandText);}); // TODO: Fix '/link' command. It should send curently watching link
// TODO: Problem with not visiting link(website)
// TODO: Fix user sended link
// TODO: Add tests
// https.createServer(bot).listen(8000, () => console.log('Server running on http://0.0.0.0:8000'));
