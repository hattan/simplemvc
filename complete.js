var app = require('./lib/simpleweb.js');

app.on("/",function(){
	app.view('index');
});

app.on("/sayhi",function(params){
	var model = { 
		name : params.name
	};
	app.view('sayhi', model);
});

app.on("/contact",function(){
	app.view('contactlist');
});

app.on("/about",function(params,req,res){
	res.write("<h2>Welcome to the about page</h2>");
})

app.on("/users",function(){
	var users = [
		{name : 'bob'},
		{name : 'mike'},
		{name : 'joe'}
	];

	app.json(users);
})

app.start();





