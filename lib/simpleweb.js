var fs = require('fs');
var url = require('url') ;
var events = require('events');
var handlebars = require("handlebars");
var http = require('http');
var qs = require('querystring');

var defaults = {
	port : 8080,
	viewFolder : "views",
	startMessage : "Server started on port "
};

var Request,
	Response,
	ee = new events.EventEmitter(),
	port = defaults.port,
	views = defaults.viewFolder,
	templates={};

exports.start = function(p,v){
  if(port)port = p;
  if(v)view = v;
};

exports.on = function(path,callBack){
	ee.on(path,function(){
		if (Request.method == 'POST') {
        	handlePost(callBack);
        }
        else{
        	handleGet(callBack);
		}
	});
};

exports.view = function(file,data){
	Response.writeHead(200,{ 'content-type' : 'text/html'});
	fs.readFile(views + '/' + file + ".html","utf8",function(err,source){
		var template = getTemplate(file,source),
			html = template(data);
    	Response.end(html);
	});
};

exports.json = function(data){
	var json = JSON.stringify(data);
	Response.writeHead(200,{'content-type' : 'application/json'});
	Response.end(json);
}

function handlePost(callBack){
	var body = '';
	Request.on('data', function (data) {
		body += data;
	});

	Request.on('end', function () {
		var params = qs.parse(body);
		callBack(params,Request,Response);               		
	});	
}

function handleGet(callBack){
	var params= url.parse(Request.url, true).query;
	callBack(params,Request,Response);
}
function getTemplate(file,source){
	var template = templates[file];
	if(!template){
		template = handlebars.compile(source);
		templates[file] = template; 
	}	
	return template;
}

http.createServer(function(req,res){
	var path = url.parse(req.url).pathname;
	Request=req;
	Response=res;
    ee.emit(path);
}).listen(port);

console.log(defaults.startMessage + port);