var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

// Java Script Object for message1

var messages = {message1: {
    title : "Messsage 1 Page",
    date  : "Date is 8th Aug 2017",
    header : "I am in Mesage 1 Page"
                },
                 message2: {
    title : "Messsage 2 Page",
    date  : "Date is 8th Aug 2018",
    header : "I am in Mesage 2 Page"
                 },
                 message3: {
    title : "Messsage 3 Page",
    date  : "Date is 8th Aug 2019",
    header : "I am in Mesage 3 Page"
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
app.get('/:messageName', function (req, res) {
  // res.send("First Message is Displayed");
  //res.sendFile(path.join(__dirname, 'ui', 'message1.html'));
  //res.send(createhtml(message1));  // sending 'message1' java script object as an parameter to function 'createhtml' that retruns 'html' page
  var messageName = req.params.messageName;
  res.send(createhtml(messages[messageName]));
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
  res.sendFile(path.join(__dirname,'ui', 'SreeCharan.JPG'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
