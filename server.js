var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var message1 = {
    title : "Messsage 1 Page",
    date  : "Date is 8th Aug 2017",
    header : "I am in Mesage 1 Page"
};

var message2 = {
    title : "Messsage 2 Page",
    date  : "Date is 8th Aug 2018",
    header : "I am in Mesage 2 Page"
};

var message3 = {
    title : "Messsage 3 Page",
    date  : "Date is 8th Aug 2019",
    header : "I am in Mesage 3 Page"
};

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
app.get('/message1', function (req, res) {
  // res.send("First Message is Displayed");
  //res.sendFile(path.join(__dirname, 'ui', 'message1.html'));
  res.sendFile(createhtml(message1));
});

app.get('/message2', function (req, res) {
  //res.send("Second Message is Displayed");
  res.sendFile(path.join(__dirname, 'ui', 'message2.html'));
  res.sendFile(createhtml(message2));
});

app.get('/message3', function (req, res) {
  //res.send("Third Message is Displayed");
  res.sendFile(path.join(__dirname, 'ui', 'message3.html'));
  res.sendFile(createhtml(message3));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
