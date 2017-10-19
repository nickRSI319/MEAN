const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoClient = require('mongodb').MongoClient

var commandArgs = process.argv.slice(2);

//The urlencoded method within body-parser tells body-parser to 
//extract data from the <form> element and
//add them to the body property in the request object.
app.use(bodyParser.urlencoded({extended: true}))

var db;

//simple write-read demo
mongoClient.connect('mongodb://192.168.99.100:9003/test', function(err, database) {
	db = database;
	console.log("Connected to mongo");
	console.log(err);
	//InsertDocuments(database, function(){
		//FindDocuments(database, function() {
			//database.close();
		//});
	//});
})

var rootDocument;

//commandArgs.$0 contains the first two elements of process.argv joined together - "node ./myapp.js".
//commandArgs._ is an array containing each element not attached to a flag.
//Individual flags become properties of argv, such as with myArgs.h and myArgs.help. Note that non-single-letter flags must be passed in as --flag.
switch (commandArgs[0]) {
	case 'ejs':
	  app.set('view engine', 'ejs');
	  rootDocument = 'index.ejs'
	  getEJSIndex();

	  break;
	case 'ang':
	  rootDocument = 'angular.html'
	  getAngularIndex();
	  break;
	default:
		app.set('view engine', 'ejs');
		rootDocument = 'index.ejs'
		getEJSIndex()();
  }


function getAngularIndex(){
	app.get('/', function (req, res) {
		//res.send(__dirname)//a string
		//OR
		//res.sendFile(__dirname + '/index.html')//a file
		//OR
		//serve a templated html file
		res.sendFile(__dirname + '/' + rootDocument)//a file
		
	})
}

function getEJSIndex(){
	app.get('/', function (req, res) {
		//res.send(__dirname)//a string
		//OR
		//res.sendFile(__dirname + '/index.html')//a file
		//OR
		//serve a templated html file
		var cursor = db.collection('quotes')
		
		if(cursor){
			cursor.find().toArray(function(err, results){
				res.render(rootDocument, {quotes : results})
				console.log(results);
			});
		}
		else{
			res.render(rootDocument)
		}
	})
}

app.listen(8081, function(){
	console.log('app listening on 8081');
	console.log(commandArgs);
	console.log(rootDocument);
})

//POST Save Quotes to mongo
app.post('/saveQuote', function(req, res) {
	db.collection('quotes').save(req.body, function(err, result)
	  {
		  if(err) return console.log(err);
		  
		  res.redirect('/');
	  });
  })


//Read mongo
var FindDocuments = function(db, callback){
	var collection = db.collection("testDocuments");
	
	collection.find({}).toArray(function(err,docs){
		console.log("found documents:");
		console.log(docs)
		callback(docs);		
	});
	
}

//Insert mongo
var InsertDocuments = function(db, callback){
	var collection = db.collection('testDocuments');
	
	collection.insertMany([{a:1},{b:2},{c:3}],
	function(err,result) {
		console.log("inserted 3 documents into collection");
		callback(result);
	});
}


//mongodb.github.io/node-mongodb-native/2.2/quick-start/quick-start/
//Update
//Delete
