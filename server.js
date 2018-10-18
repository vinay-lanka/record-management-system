var express = require('express');
var app = express();
var password = "database"
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res)=> {
  res.sendFile(__dirname + "/public/home.html");
});
app.get('/bad', (req, res)=> {
  res.send('Some error has occoured. Please check and try again');
});
app.get('/made_adhaar', function(req, res){
    var details = req.query;
    if(req.query.password == password){
      console.log(details);
      res.sendFile(__dirname + "/public/adhaar_made.html");
    }else if(req.query.password != password){
      res.sendFile(__dirname + "/public/adhaar_not_made.html")
    }
});
app.listen(3000);
