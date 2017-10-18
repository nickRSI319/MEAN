const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoClient = require('mongodb').MongoClient

//The urlencoded method within body-parser tells body-parser to //extract data from the <form> element and add them to the body //property in the request object.
app.use(bodyParser.urlencoded({extended: true}))

var db;

//simple write-read demo
mongoClient.connect('mongodb://192.168.99.100:9001/test', function(err, database) {
	db = database;
	//console.log("Connected to mongo");
	//InsertDocuments(database, function(){
		//FindDocuments(database, function() {
			//database.close();
		//});
	//});
})

app.set('view engine', 'ejs');

app.listen(8081, function(){
	console.log('app listening on 8081')
})

//GET root
app.get('/', function (req, res) {
	//res.send(__dirname)//a string
	//OR
	//res.sendFile(__dirname + '/index.html')//a file
	//OR
	//serve a templated html file
	var cursor = db.collection('quotes').find().toArray(function(err, results){
		res.render('index.ejs', {quotes : results})
		console.log(results);
	});

	
})

//POST Save Quotes
app.post('/saveQuote', function(req, res) {
  db.collection('quotes').save(req.body, function(err, result)
	{
		if(err) return console.log(err);
		
		res.redirect('/');
	});
})

//CREATE
var InsertDocuments = function(db, callback){
	var collection = db.collection('testDocuments');
	
	collection.insertMany([{a:1},{b:2},{c:3}],
	function(err,result) {
		console.log("inserted 3 documents into collection");
		callback(result);
	});
}

//Read
var FindDocuments = function(db, callback){
	var collection = db.collection("testDocuments");
	
	collection.find({}).toArray(function(err,docs){
		console.log("found documents:");
		console.log(docs)
		callback(docs);		
	});
	
}

//mongodb.github.io/node-mongodb-native/2.2/quick-start/quick-start/
//Update
//Delete
