var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var path = require('path');



var server = http.createServer(function(req, res){
	if (req.url === "/") {
	     res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream("./public/index.html","UTF-8").pipe(res);
	}

	else if (req.url.match("\.css$")) {
   	var cssPath = path.join(__dirname , 'public', req.url);
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
      res.writeHead(200, {'Content-Type': 'text/css'});
    fileStream.pipe(res);
   }
   else if (req.url.match("\.jpg$")) {
   	var imgPath = path.join(__dirname , 'public', req.url);
    var fileStream = fs.createReadStream(imgPath);
      res.writeHead(200, {'Content-Type': 'images/jpg'});
    fileStream.pipe(res);
}
	if (req.method === "POST") {
		var data = "";
		req.on("data",function(chunk){
			data += chunk;
		});
		req.on("end" , function(chunk){
		MongoClient.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true },function(err, db) {
			  if (err) throw err;
			    var dbo = db.db("college");
		var q = querystring.parse(data);
		dbo.collection('students').insertOne(q, function(err, res){
			if (err) throw err;
			console.log("data inserted");
			db.close();


		});
           
           });



		});

	}

	});

server.listen(3000);