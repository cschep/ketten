var RTFParser = function(rtfText) {
  this.rtfText = rtfText;
  this.ignoreList = [];
};

RTFParser.prototype.removeIgnoredLines = function() {
  var rtfText = this.rtfText;
  for (var i = 0; i < this.ignoreList.length; i++) {
    rtfText = rtfText.replace(this.ignoreList[i], '');
  }

  return rtfText;
};

RTFParser.prototype.parse = function(cb) {
  var rtfText = this.removeIgnoredLines();

  var currentArtist = '';
  var currentWord = '';
  var currentControlWord = '';
  var controlWordActive = false;
  var groupActive = false;
  var bold = true;
  var colorGroup = false;
  var garbageChars = 0;

  var result = [];

  var unicodeReplacements = {
    'u225': 'a',
    'u228': 'a',
    'u230': 'ae',
    'u231': 'c',
    'u233': 'e',
    'u237': 'i',
    'u241': 'n',
    'u243': 'o',
    'u246': 'o',
    'u255': 'y',
    'u339': 'oe',
    'u8224': '†'
  };

  function checkControlWord() {
    var colorRegex = /c[f|b]\d/g;
    if (currentControlWord === 'b') {
      bold = true;
    } else if (currentControlWord === 'b0') {
      bold = false;
    } else if (colorRegex.test(currentControlWord)) {
      colorGroup = true;
    } else if (unicodeReplacements.hasOwnProperty(currentControlWord)) {
      currentWord += unicodeReplacements[currentControlWord];
    }
  }

  for (var i = 0; i < rtfText.length; i++) {
    var ch = rtfText[i];
    if (garbageChars > 0) {
      garbageChars--;
    } else {
      if (ch === '\n') {
        if (currentWord !== '') {
          if (bold) {
            currentArtist = currentWord.replace('\t', '');
          } else {
            let parts = currentWord.trim().split('\t(');

            var title, brand;
            if (parts.length > 1) {
              title = parts[0];
              brand = parts[1].replace(')', '');
            } else if (parts.length > 0) {
              title = parts[0];
            }

            if (brand == undefined) {
              var song = { artist: currentArtist, title: title };
            } else {
              var song = { artist: currentArtist, title: title, brand: brand };
            }

            if (this.onSong) {
              this.onSong(song);
            }

            result.push(song);
          }
        }

        currentWord = '';
      } else if (ch === '\\') {
        if (controlWordActive) {
          checkControlWord();

          currentControlWord = '';
        } else {
          controlWordActive = true;
        }
      // } else if (ch === '\'') {
      //   if (controlWordActive) {
      //     controlWordActive = false;
      //     garbageChars = 2;
      //   }
      // } else if (ch === '\t') {
      //   if (controlWordActive) {
      //     checkControlWord();

      //     currentControlWord = '';
      //     controlWordActive = false;
      //   }
      } else if (ch === ' ') {
        if (controlWordActive) {
          checkControlWord();

          currentControlWord = '';
          controlWordActive = false;
        } else {
          currentWord += ch;
        }
      } else if (ch === '{') {
        groupActive = true;
        currentWord = '';
      } else if (ch === '}') {
        groupActive = false;
        colorGroup = false;
      } else {
        if (controlWordActive) {
          currentControlWord += ch;
        } else {
          if (!groupActive || colorGroup) {
            currentWord += ch;
          }
        }
      }
    }
  }

  if (cb) {
    cb(result);
  }
};

// Do we really need this?
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = RTFParser;
  }
  exports.RTFParser = RTFParser;
}

const fs = require('fs');
try {
  const rtfText = fs.readFileSync('/Users/cschep/Downloads/81122.rtf', 'utf8');
  const rtfParser = new RTFParser(rtfText);
  const ignoreListStrings = [
    "Song List Generator",
    "iphone app!",
    "John Brophy",
    "rare and unique",
    "BKK",
    "Printed",
    "Title",
  ];
  rtfParser.ignoreList = ignoreListStrings.map(function(item) {
    if (item !== '') {
      return new RegExp('.*' + item + '.*', 'g');
    }
  });
  rtfParser.parse(function(songs) {
    console.log(songs);
  });

} catch (err) {
  console.error(err);
}
