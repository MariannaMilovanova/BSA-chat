var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var messages = [];
var users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', function(req, res) {
    res.sendFile(__dirname + '/script.js');
});
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/style.css');
});

app.get('/messages', function(req, res) {
    res.json(messages);
})

app.post('/messages', function(req, res) {
    messages.push(req.body);
})

app.get('/users', function(req, res) {
    res.json(users);
})

app.post('/users', function(req, res) {
    users.push(req.body);
})

http.listen(8000, function() {
    console.log("listening on *:8000");
});