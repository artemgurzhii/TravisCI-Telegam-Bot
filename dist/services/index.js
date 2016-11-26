"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _https=require("https");var _https2=_interopRequireDefault(_https);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var currBuild=0;var prevBuild=0;var GettingData=function(){function GettingData(){_classCallCheck(this,GettingData);}_createClass(GettingData,[{key:"sliceMsg",/**
	 * Function accept string as argument, and return user id, repository and url for request.
	 *
	 * @param {string} msg String to slice.
	 */value:function sliceMsg(msg){var id=msg.slice(msg.lastIndexOf("org")+4,msg.lastIndexOf("/"));var repository=msg.slice(msg.lastIndexOf("/")+1);return{id:id,repository:repository,url:"https://api.travis-ci.org/repositories/"+id+"/"+repository+".json"};}/**
	 * Make request for .json file and return data from it.
	 *
	 * @param {string} url URL for https request.
	 * @param {function} cb Callback function to execute, when request is done.
	 */},{key:"req",value:function req(url,cb){_https2.default.get(url,function(res){var str="";res.on("data",function(data){str+=data;});res.on("end",function(){var parsed=JSON.parse(str);// If url request dosn't return any data
if(parsed.file){cb("You have send invalid link, please send valid link",false);}currBuild=parsed.last_build_number;// If build variables wasn't set and had initiale value
if(prevBuild===0&&currBuild===0){prevBuild=parsed.last_build_number;currBuild=prevBuild;}// If new build were ended
if(prevBuild!==currBuild&&parsed.last_build_finished_at){// Link address
var link="https://travis-ci.org/"+parsed.slug;// Message variables, build: started, ended and etc
var start=parsed.last_build_started_at;var end=parsed.last_build_finished_at;var started=start.slice(start.indexOf("T")+1,start.length-1);var ended=end.slice(end.indexOf("T")+1,end.length-1);// Reassigning build variables
currBuild=parsed.last_build_number;prevBuild=parsed.last_build_number;// Callback function
cb("Hi, your build at "+link+" repository just has ended. \nYour build "+(parsed.last_build_status===0?"completed successfully":"failed")+". \nBuild number was "+parsed.last_build_number+". \nYour build started at "+started+" and finished at "+ended+". Link to build: "+link+"/builds/"+parsed.last_build_id,true);}else if(!parsed.last_build_finished_at){// If build is currently running
prevBuild=parsed.last_build_number-1;}});}).end();}}]);return GettingData;}();exports.default=GettingData;