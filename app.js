var express = require('express');

var app = express();
app.set('view engine', 'jade');

app.use('/js', express.static(__dirname + "/public/js"));

app.get('/', function(req, res){
	res.render('index');
})

app.listen(3000);