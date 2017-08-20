var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool; // for DB connection with Postgres DB
var crypto = require('crypto'); // for Password Hashing 
// Install 'body-parser' module 'npm install body-parser ' before using 
var bodyParser = require('body-parser'); // we are telling to read the data that is in body of HTTP POST request
// for handling session using cookies
var session = requires('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); // using 'json' from bodyParser accept JSON data from the HTTP POST request
app.use(session({
    secret: "someRandonSccretValue",
    cookie: {maxAge: 1000*60*60*24*30}  // 1000*60 is 1 minute and 1000*60*60 is 1 hour and 1000*60*60*24 is 1 day , 1000*60*60*24*30 is 1 month
    
}));

var config = {
	user: 'sudheergandla',
	database: 'sudheergandla',
	host: 'db.imad.hasura-app.io',
	port: '5432',
	password: 'db-sudheergandla-1436'
	//password: process.env.DB_PASSWORD
};

// creates a connection to DB
var pool = new Pool(config);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.get('/test-db',function(req,res){
	pool.query('SELECT * FROM tag',function(err,results){
		if (err) {
		res.status(500).send(err.toString());	
		}
		else {
		// res.send(JSON.stringify(results));	// produces JSON object 
		res.send('Rows in the table are ' + JSON.stringify(results.rows));	 // retrieving only rows from JSON Object - results 
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

function hash_create(input,salt){
	// creating a Hash using crypto 
	var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512'); // output is sequence of bytes that is going to store in 'hashes' variable here
	return hashed.toString('hex');  // converting it to readbale and printable on the screen using toString() function
}

// Password Hashing
app.get('/hash/:input',function(req,res){
	var hashedString = hash_create(req.params.input,'this-is-some-randon-string');
	res.send(hashedString);
});

function hash(input,salt){
	// creating a Hash using crypto 
	var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512'); // output is sequence of bytes that is going to store in 'hashes' variable here
	// return hashed.toString('hex');  // converting it to readbale and printable on the screen using toString() function
	var arryHashed = ['pbkdf2','10000',salt,hashed.toString('hex')] ; //creating an array to have different elemetns along with hashed string
	return arryHashed.join('$');
}

app.post('/create-user',function(req,res){
	
	// we will retriving username and password from HTTP post request which will be in body of the POST request 
	// data will be in JSON format in body of the POST request example {"username": "sudheer","password": "XXX***HELLO"}
	var username = req.body.username;
	var password1 = req.body.password;
	var salt = crypto.randomBytes(128).toString('hex');
	var dbPasswordStr = hash(password1,salt);
	pool.query('INSERT INTO "user_login" (username,password) VALUES ($1,$2)',[username,dbPasswordStr],function(err,result){
		if (err){
			res.status(500).send(err.toString());
		}
		else{
			res.send('User is Created Successfully ' + username);
		}
		
	});
	
});

app.post('/LoginAuth',function(req,res){
	
	// we will retriving username and password from HTTP post request which will be in body of the POST request 
	// data will be in JSON format in body of the POST request example {"username": "sudheer","password": "XXX***HELLO"}
	var username = req.body.username;
	var password1 = req.body.password;
	
	var salt = crypto.randomBytes(128).toString('hex');
	
	pool.query('SELECT * from "user_login" WHERE username = $1',[username],function(err,result){
		if (err){
			res.status(500).send(err.toString());
		}
		else{
			if (result.rows.length == 0){
			res.status(400).send('No User Found / Worong User Name : ' + username);		
			}
			else{
				var dbPasswordStr = result.rows[0].password
				var salt = dbPasswordStr.split('$')[2];
				var hashpasswd = hash(password1,salt); //creating a hashedpassword for the password submitted (password1)
				if (hashpasswd == dbPasswordStr){
				    //setting a cookie with session id that generates randomly
				    // internally on server side it maps the session id to the object and it conatins another object called 'auth'
				    // 'auth' contains ex : {auth: "username"}
				    req.session.auth = {userid: result.rows[0].userid};
				    
				res.send('Login is Successfull for  ' + username);
				}
				else{
					res.send('Login is not Successfull for  ' + username);
				}
			}
		}
		
	});
	
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
      
      <!--  <div> ${date}</div>   -->
	  <!-- // when fetched from Postgres DB , Date is priting in JavaScript Script and we used toDateString() frunction to convert it into String -->
	  <div> ${date.toDateString()} </div>
	  
      
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

app.get('/articles/:articleName', function (req, res) {
  // res.send("First Article is Displayed");
  //res.sendFile(path.join(__dirname, 'ui', 'article1.html'));
  //res.send(createhtml(article1));  // sending 'article1' java script object as an parameter to function 'createhtml' that retruns 'html' page
  var articleName = req.params.articleName;
  //  Query looks like SELECT * FROM "articles" WHERE "name" = 'article1'
   // pool.query('Select * from articles where name = ' + "'" + articleName + "'",function(err,results){
  // pool.query('Select * from articles where name = ' + "\'" + articleName + "\'",function(err,results){
  pool.query('Select * from articles where name = $1',[articleName],function(err,results){
	  if (err) {
		res.status(500).send(err.toString());	
		}
	  else {
		  if (results.rows.length == 0) {
			  res.status(400).send('no Article is present with name : "' + articleName + '"');
		  }
		  else {
			  var articleData = results.rows[0];
			  res.send(createhtml(articleData));
		  }
	  }
  });
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