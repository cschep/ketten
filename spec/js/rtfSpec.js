var assert = require('assert')
var RTFParser = require('../../public/rtf.js');
var fs = require('fs');

describe('parse', function() {
  it('should parse big file', function(done) {
    fs.readFile(__dirname + '/data/Song_List_by_Artist-NEW.rtf', 'utf8', function(err, data) {
      if (err) { console.log('error: ' + err) }
      var rtfParser = new RTFParser(data);
      rtfParser.ignoreList = [
        /.*Song List Generator.*/g,
        /.*iphone app!.*/g,
        /.*John Brophy.*/g,
        /.*rare and unique.*/g,
        /.*BKK.*/g,
        /.*Printed.*/g,
      ];

      rtfParser.parse(function(result) {
        assert.equal(31313, result.length);
        done();
      });
    });
  });

  it('should parse small file', function(done) {
    fs.readFile(__dirname + '/data/latest_ketten_small.rtf', 'utf8', function(err, data) {
      if (err) { console.log('error: ' + err) }
      var rtfParser = new RTFParser(data);
      rtfParser.ignoreList = [
        /.*Song List Generator.*/g,
        /.*iphone app!.*/g,
        /.*John Brophy.*/g,
        /.*rare and unique.*/g,
        /.*BKK.*/g,
        /.*Printed.*/g,
        /.*Title.*/g
      ];

      rtfParser.parse(function(result) {
        assert.equal(402, result.length);
        done();
      });
    });
  });

  it('should parse new broken file', function(done) {
    fs.readFile(__dirname + '/data/latest_broken.rtf', 'utf8', function(err, data) {
      if (err) { console.log('error: ' + err) }
      var rtfParser = new RTFParser(data);
      rtfParser.ignoreList = [
        /.*Song List Generator.*/g,
        /.*iphone app!.*/g,
        /.*John Brophy.*/g,
        /.*rare and unique.*/g,
        /.*BKK.*/g,
        /.*Printed.*/g,
      ];

      rtfParser.parse(function(result) {
        assert.equal(31604, result.length);
        done();
      });
    });
  });

  it('should parse unicode test file', function(done) {
    fs.readFile(__dirname + '/data/unicode_test.rtf', 'utf8', function(err, data) {
      if (err) { console.log('error: ' + err) }
      var rtfParser = new RTFParser(data);
      rtfParser.ignoreList = [
        /.*Song List Generator.*/g,
        /.*iphone app!.*/g,
        /.*John Brophy.*/g,
        /.*rare and unique.*/g,
        /.*BKK.*/g,
        /.*Printed.*/g,
      ];

      rtfParser.parse(function(result) {
        assert.equal(57, result.length);
        done();
      });
    });
  });
});
