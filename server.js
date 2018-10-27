var express = require('express');
const hbs = require('hbs');
var bodyParser = require('body-parser');

var app = express();
var password = 'database';


const {MongoClient, ObjectID} = require('mongodb');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('viewengine', 'hbs');
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res)=> {
  res.sendFile(__dirname + "/public/home.html");
});
app.get('/bad', (req, res)=> {
  res.send('Some error has occoured. Please check and try again');
});
app.post('/made_adhaar', function(req, res){
    var details = req.body;
    if(details.password == password){
      console.log(details);

      MongoClient.connect('mongodb://localhost:27017/Details', (err, client) => {
        if (err) {
          return console.log('Unable to connect');
        }
        console.log('Connected to Mongo Database Server');
        const db = client.db('Details');
        db.collection('Adhaar').insertOne(details , (err, result) => {
          if (err){
            return console.log('Unable to insert', err);
          }
          console.log(JSON.stringify(result.ops, undefined, 2));
        });
        client.close();
      });

      res.sendFile(__dirname + "/public/adhaar_made.html");
    }else if(req.query.password != password){
      res.sendFile(__dirname + "/public/not_made.html")
    }
});


app.post('/signin_adhaar', function(req, res){
    var details = req.body;

    if(details.password == password){

      MongoClient.connect('mongodb://localhost:27017/Details', (err, client) => {
        if (err) {
          return console.log('Unable to connect');
        }
        console.log('Connected to Mongo Database Server');
        const db = client.db('Details');
        db.collection("Adhaar").findOne({adhaarid : details.adhaarid}, function(err, result) {
            if (err) throw err;
            if(result.dl == 'True'){
              res.render('a_details_wdl.hbs', result);
            }else{
              res.render('a_details_wodl.hbs',result);
            }
        });
          client.close();
      });

    }else if(req.query.password != password){
      res.sendFile(__dirname + "/public/not_made.html")
    }
});

app.post('/dl_details', function(req, res){
    var details = req.body;
    MongoClient.connect('mongodb://localhost:27017/Details', (err, client) => {
      if (err) {
        return console.log('Unable to connect');
      }
      console.log('Connected to Mongo Database Server');
      const db = client.db('Details');
      db.collection("DL").findOne({adhaarid : details.adhaarid}, function(err, result) {
          if (err) throw err;
          console.log(result);
          res.render('driving_details.hbs', result);
        });
        client.close();
    });
});

app.post('/new_dl', function(req, res){
    var details = req.body;
    res.render('driving_new.hbs', details);
});

app.post('/made_dl', function(req, res){
    var details = req.body;
    if(details.password == password){
      console.log(details);

      MongoClient.connect('mongodb://localhost:27017/Details', (err, client) => {
        if (err) {
          return console.log('Unable to connect');
        }
        console.log('Connected to Mongo Database Server');
        const db = client.db('Details');
        db.collection('DL').insertOne(details , (err, result) => {
          if (err){
            return console.log('Unable to insert', err);
          }
          console.log(JSON.stringify(result.ops, undefined, 2));
        });
      var collection = db.collection("Adhaar");
      collection.findOneAndUpdate({adhaarid: details.adhaarid}, {$set: {dl: "True"}}, {upsert: true},
      function(err,doc) {
        if (err) { throw err;
        }else{
          console.log("Updated"); }
        });
      });

      res.sendFile(__dirname + "/public/dl_made.html");
    }else if(req.query.password != password){
      res.sendFile(__dirname + "/public/not_made.html")
    }
});
app.listen(3000);
