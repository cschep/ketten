var assert = require('assert')
var RTFParser = require('../../app/assets/javascripts/rtf.js');
var fs = require('fs');

describe('parse', function () {
  it('parses big new file', function(done) {
    fs.readFile(__dirname + '/data/Song_List_by_Artist-NEW.rtf', 'utf8', function(err, data) {
      if (err) { console.log('error: ' + err) }
      var rtfParser = new RTFParser(data);
      var result = rtfParser.parse();

      assert.equal(31312, result.length);

      done();
    });

  });

  it('parses small file', function(done) {
    fs.readFile(__dirname + '/data/latest_ketten_small.rtf', 'utf8', function(err, data) {
      if (err) { console.log('error: ' + err) }
      var rtfParser = new RTFParser(data);
      var result = rtfParser.parse();

      assert.equal(402, result.length);

      done();
    });

  });

});