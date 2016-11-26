"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var UserInput=function(){function UserInput(){_classCallCheck(this,UserInput);}_createClass(UserInput,[{key:"programHow",/**
   * If message is '/how'
   *
   * @param {String} msg Message received from user.
   */value:function programHow(msg){return msg.match("/how");}/**
   * If message is '/link'
   *
   * @param {String} msg Message received from user.
   */},{key:"programLink",value:function programLink(msg){return msg.match("/link");}/**
   * If message is '/start'
   *
   * @param {String} msg Message received from user.
   */},{key:"programStart",value:function programStart(msg){return msg.match("/start");}// message is "'stop'
/**
   * If message is '/stop'
   *
   * @param {String} msg Message received from user.
   */},{key:"programStop",value:function programStop(msg){return msg.match("/stop");}/**
   * If user send valid Travis-CI link
   *
   * @param {String} msg Message received from user.
   */},{key:"programValidLinkSended",value:function programValidLinkSended(msg){return msg.match(/https:\/\/travis-ci\.org\/\S+\/\S+$/);}}]);return UserInput;}();exports.default=UserInput;