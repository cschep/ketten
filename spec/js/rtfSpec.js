const assert = require('assert');
const RTFParser = require('../../public/rtf.js');
const fs = require('fs');

const standardIgnoreList = [
  "Song List Generator",
  "iphone app!",
  "John Brophy",
  "rare and unique",
  "BKK",
  "Printed",
  "Title",
];

// should parse big file
function parseBigFile() {
  console.log("parse big file");
  fs.readFile(__dirname + '/data/Song_List_by_Artist-NEW.rtf', 'utf8', function (err, data) {
    if (err) {
      console.log('error: ' + err);
    }
    let rtfParser = new RTFParser(data, standardIgnoreList);

    rtfParser.parse(function (result) {
      assert.equal(31311, result.length);
    });
  });
}

function parseSmallFile() {
  fs.readFile(__dirname + '/data/latest_ketten_small.rtf', 'utf8', function (err, data) {
    console.log("parse small file");
    if (err) { console.log('error: ' + err); }
    let rtfParser = new RTFParser(data, standardIgnoreList);

    rtfParser.parse(function (result) {
      assert.equal(402, result.length);
    });
  });
}

// should parse new broken file
function parseNewBrokenFile() {
  console.log("parse new broken file");
  fs.readFile(__dirname + '/data/latest_broken.rtf', 'utf8', function(err, data) {
    if (err) { console.log('error: ' + err); }
    let rtfParser = new RTFParser(data, standardIgnoreList);

    rtfParser.parse(function(result) {
      assert.equal(31604, result.length);
    });
  });
}

// should parse unicode test file
function parseUnicodeTestFile() {
  console.log("parse unicode test file");
  fs.readFile(__dirname + '/data/unicode_test.rtf', 'utf8', function(err, data) {
    if (err) { console.log('error: ' + err); }
    let rtfParser = new RTFParser(data, standardIgnoreList);

    rtfParser.parse(function(result) {
      assert.equal(57, result.length);
    });
  });
}

// should parse most recent file (lol, old)
function parseMostRecentFile() {
  console.log("parse most recent file  (11-11-15)");
  fs.readFile(__dirname + '/data/ketten-111115.rtf', 'utf8', function(err, data) {
    if (err) { console.log('error: ' + err); }
    let rtfParser = new RTFParser(data, standardIgnoreList);

    rtfParser.parse(function(result) {
      assert.equal(31896, result.length);
    });
  });
}

// should parse groups
function parseGroups() {
  console.log("parse groups");
  fs.readFile(__dirname + '/data/group_test.rtf', 'utf8', function (err, data) {
    if (err) {
      console.log('error: ' + err);
    }
    let rtfParser = new RTFParser(data, standardIgnoreList);

    rtfParser.parse(function (result) {
      assert.equal(30, result.length);
    });
  });
}

function parseNewCheckpointFile() {
  console.log("parse latest checkpoint (3-21-23)");
  fs.readFile(__dirname + '/data/ketten-3-21-2023.rtf', 'utf8', function (err, data) {
    if (err) {
      console.log('error: ' + err);
    }
    let rtfParser = new RTFParser(data, standardIgnoreList);

    rtfParser.parse(function (result) {
      assert.equal(45891, result.length);
    });
  });
}

// these actually parallelize which is cool but
// maybe will introduce a horrible bug someday so keep your eye's peeled 👀
parseBigFile();
parseSmallFile();
parseNewBrokenFile();
parseUnicodeTestFile();
parseMostRecentFile();
parseGroups();
parseNewCheckpointFile();
