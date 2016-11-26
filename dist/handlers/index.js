"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _index=require("../services/index");var _index2=_interopRequireDefault(_index);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var initialize=new _index2.default();var watching=true;/** Class representing all commands available to user. */var Command=function(){function Command(){_classCallCheck(this,Command);}/**
   * Respond to '/how' command
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   */_createClass(Command,[{key:"how",value:function how(bot,message){bot.sendMessage(message.from,"You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/emberjs/ember.js \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.");}/**
   * Respond to '/link' command
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   * @param {String} url URL For HTTPS request.
   */},{key:"link",value:function link(bot,message,text){bot.sendMessage(message.from,text);}/**
   * Respond to '/start' command
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   */},{key:"start",value:function start(bot,message){watching=true;bot.sendMessage(message.from,"Ok, since now I will watch for changes.");}/**
   * Respond to '/stop' command
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   */},{key:"stop",value:function stop(bot,message){watching=false;bot.sendMessage(message.from,"Ok, since now I'm stoping watching for changes.");}/**
   * Make request each 7 seconds to get data.
   *
   * @param {Function} bot Instance of 'bot' class.
   * @param {String} msg Message to sent to user.
   * @param {String} url URL For HTTPS request.
   */},{key:"data",value:function data(bot,msg,url){var interval=setInterval(function(){var data=void 0;initialize.req(url,function(res,valid){data=res;if(watching&&data){if(!valid){clearInterval(interval);}bot.sendMessage(msg.from,data);}});},7000);bot.sendMessage(msg.from,"Ok, since now I will watch for changes.");}}]);return Command;}();exports.default=Command;