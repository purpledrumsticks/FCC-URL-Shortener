let shortId = require('shortid');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Url = new Schema({
  original_url: {type: String, required: true},
  short_id: {type: String, required: true, default: shortId.generate}
});

module.exports = mongoose.model('Url', Url);
