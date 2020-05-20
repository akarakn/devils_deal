var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(":memory:");

db.serialize( () =>{
  db.run("CREATE TABLE deals (id INT, good TEXT, bad TEXT)");

  var stmt = db.prepare("INSERT INTO deals VALUES (?,?,?)");
    stmt.run(
      0,
      "Dünya üzerindeki tüm bilgileri bileceksin.",
      "Bilgi seni depresyona sokacak. Bunu yalnızca bir kaç kişiyle paylaşabileceksin ve 1 yıl içinde ömrün tükenecek."
    );
    stmt.run(
      1,
      "Hayalini kurduğun dünyada yaşayacaksın.",
      "İlk 48 saati şimdiye dek gördüğün ek kötü kabusu izleyerek geçireceksin."
    );
    stmt.run(
      2,
      "Tüm hayallerin gerçekleşecek",
      "Bundan sonra arzuladığın hiç bir şeyi elde edemeyeceksin. Ne kadar uğraşırsan uğraş."
    );
    stmt.run(
      3,
      "Dünyanın açlık sorununa çare bulacaksın.",
      "Hayatın boyunca obez yaşayacaksın."
    );
    stmt.run(
      4,
      "Hayatın boyunca hayallerini kurduğun evde yaşayacaksın.",
      "En gıcık olduğun ünlü ile ev arkadaşı olacaksın."
    );
    
  stmt.finalize();
  console.log("Deals");
  db.each("SELECT id, good, bad FROM deals",  (err, row)=> {
    console.log(row.id, row.good, row.bad);
  });
    
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get('/new',  (req, res) =>{
    db.get(
      "SELECT id, good, bad FROM deals ORDER BY RANDOM() LIMIT 1;",
       (err, row)=> {
          console.log("random: ", row.id, row.good, row.bad);
          let deal = { id: row.id, good: row.good, bad: row.bad };
          res.send(deal);
      }
    );

    
})
app.get('/deal',  (req, res)=> {
    res.send("Not Implemented");
})


module.exports = app;
