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
    'u339': 'oe'
  }

  function checkControlWord() {
    if (currentControlWord === 'b') {
      bold = true;
    } else if (currentControlWord === 'b0') {
      bold = false;
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
            currentArtist = currentWord;
          } else {
            var song = {artist: currentArtist, title: currentWord}
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

      } else if (ch === '\'') {
        if (controlWordActive) {
          controlWordActive = false;
          garbageChars = 2;
        }
      } else if (ch === '\t') {
        if (controlWordActive) {
          checkControlWord();

          currentControlWord = '';
          controlWordActive = false;
        }
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
      } else if (ch === '}') {
        groupActive = false;
      } else {
        if (!groupActive) {
          if (controlWordActive) {
            currentControlWord += ch;
          } else {
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

//I S O M O R P H I C
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = RTFParser;
  }
  exports.RTFParser = RTFParser;
}

