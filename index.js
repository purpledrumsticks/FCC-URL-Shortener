/*
  Shout out to https://github.com/dting! I would not have been able to figure this out without the code provided by him.
  A lot of this project can be attributed to him.
*/
let validUrl = require('valid-url');
let Url = require('./app/url.js');

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

let baseUrl = process.env.MONGOLAB_URI || ('http://localhost:' + 3000 + '/');

let express = require('express');
let app = express();
app.use('/', express.static('./public'));

app.get('/new/*', function (req, res) {
  let original = req.url.replace('/new/', '');
  if (!validUrl.isWebUri(original)) {
    return res.json({error: "Url invalid"});
  }
  Url.create({original_url: original}, function (err, created) {
    if (err) return res.status(500).send(err);
    res.json({
      original_url: created.original_url,
      short_url: baseUrl + created.short_id
    });
  });
});

app.get('/*', function (req, res) {
  Url.findOne({short_id: req.url.slice(1)}).exec().then((found) => {
    if (found) {
      res.redirect(found.original_url);
    } else {
      res.send({error: "No short url found for given input"});
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening');
});
