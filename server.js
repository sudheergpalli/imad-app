var express = require('express');
var morgan = require('morgan');
var path = require('path');

var pool = require('pg').pool;

var config = {
	user: 'sudheergandla',
	database: 'sudheergandla',
	host: 'db.imad.hasura-app.io',
	port: '5432',
	password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

// creates a connection to DB
var pool = new pool(config);
app.get('/test-db',function(req,res){
	pool.query('SELECT * from user',function(err,results){
		if (err) {
		res.status(500).send(err.toString());	
		}
		else {
		res.send(JSON.stringify(results));	
		}
	});
});

//adding  endpoint 'counter'
var counter = 0;
app.get('/counter',function(req,res){
  counter = counter + 1;
  res.send(counter.toString());
});

/*
//adding end point called 'submit-name' along with a value and it will be displayed on the screen
// by adding that value to existing array
var names = []; //empty javascript Array
app.get('/submit-name/:name',function(req,res){	
	var name = req.params.name; 	
	names.push(name);
	res.send(JSON.stringify(names));
}); */

//adding end point called 'submit-name' using string paramater with a question mark after end point ex: /submit-name?name=XXXX
// and it will be displayed on the screen
// by adding that value to existing array
var names = []; //empty javascript Array
app.get('/submit-name',function(req,res){	
	var name = req.query.name;   // here 'name' in req.query.name should match with query string parameter that is in between ? and = symbol
	// if 'name' object is returned as Not Null (returned an object)
	if (name != undefined) {
	names.push(name);
	res.send(JSON.stringify(names));
	}
	// if 'name' object is returned as Null (undefined)
	else{
		res.send('error: something wrong in the string after question mark')
	}
}); 


app.get('/favicon.ico', function (req, res) {
  //res.send("i am in FAV ICON");
  res.sendFile(path.join(__dirname, 'favicon.ico'));
}); 

app.get('/sudheer', function (req, res) {
  res.send("i am in sudheer page");
});


// Java Script Object for article1

var articles = {article1: {
    title : "Article 1 Page",
    date  : "Date is 8th Aug 2017",
    header : "I am in Article 1 Page"
                },
                 article2: {
    title : "Article 2 Page",
    date  : "Date is 8th Aug 2018",
    header : "I am in Article 2 Page"
                 },
                 article3: {
    title : "Article 3 Page",
    date  : "Date is 8th Aug 2019",
    header : "I am in Article 3 Page"
                 }
};
// function to return html using java script object as an argument .
function createhtml(data){
    
    var title = data.title;
    var date = data.date;
    var header = data.header;
    
    var htmlcontent = `<html>
    <head>
      <title> ${title} </title>
    </head>
    <body>
      <div>
        <a href="/"> Home </a>
        <hr/>
      </div>
      
      <div> ${date} </div>
      
      <h1> ${header} </h1>
      
    </body>
    </html>`;
    return htmlcontent;     
}

// here :/articleName stands for URL pattern match i.e anything that comes after / , below code is executed 
app.get('/:articleName', function (req, res) {
  // res.send("First Article is Displayed");
  //res.sendFile(path.join(__dirname, 'ui', 'article1.html'));
  //res.send(createhtml(article1));  // sending 'article1' java script object as an parameter to function 'createhtml' that retruns 'html' page
  var articleName = req.params.articleName;
  res.send(createhtml(articles[articleName]));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

//if you don't write below code , your java script that is mentioned in index.html file does not work and return http status code 404
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/SreeCharan.JPG', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','SreeCharan.JPG'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
