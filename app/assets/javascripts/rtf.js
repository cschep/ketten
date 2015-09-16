var RTFParser = function(rtfText) {
  this.rtfText = rtfText;
  this.defaultIgnoreList = [
    /.*Song List Generator.*/g,
    /.*iphone app!.*/g,
    /.*John Brophy.*/g,
    /.*rare and unique.*/g,
    /.*BKK.*/g,
    /.*Printed.*/g,
    /.*Title.*/g
  ];
};

RTFParser.prototype.removeIgnoredLines = function() {
  var rtfText = this.rtfText;
  for (var i = 0; i < this.defaultIgnoreList.length; i++) {
    rtfText = rtfText.replace(this.defaultIgnoreList[i], '');
  }

  return rtfText;
};

RTFParser.prototype.parse = function() {
  var rtfText = this.removeIgnoredLines();
  // var rtfText = this.rtfText;

  var currentArtist = '';
  var currentWord = '';
  var currentControlWord = '';
  var controlWordActive = false;
  var groupActive = false;
  var bold = false;

  var result = [];

  function checkBold() {
    if (currentControlWord === 'b') {
      bold = true;
    } else if (currentControlWord === 'b0') {
      bold = false;
    }
  }

  for (var i = 0; i < rtfText.length; i++) {
    var ch = rtfText[i];
    if (ch === '\n') {
      if (currentWord !== '') {
        if (bold) {
          currentArtist = currentWord;
        } else {
          result.push({artist: currentArtist, title: currentWord});
        }
      }

      currentWord = '';
    } else if (ch === '\\') {
      if (controlWordActive) {
        checkBold();

        currentControlWord = '';
      } else {
        controlWordActive = true;
      }

    } else if (ch === '\t') {
      if (controlWordActive) {
        checkBold();

        currentControlWord = '';
        controlWordActive = false;
      }
    } else if (ch === ' ') {
      if (controlWordActive) {
        checkBold();

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

  return result;
};

RTFParser.prototype.parseSongbook = function(cb) {
  var result = [];

  //remove garbage
  var regexs = [];
  regexs.push(/.*Song List Generator.*/g);
  regexs.push(/.*iphone app!.*/g);
  regexs.push(/.*John Brophy.*/g);
  regexs.push(/.*rare and unique.*/g);
  regexs.push(/.*BKK.*/g);
  regexs.push(/.*Printed.*/g);
  regexs.push(/.*Title.*/g);

  var rtfText = this.rtfText;
  for (var i = 0; i < regexs.length; i++) {
    rtfText = rtfText.replace(regexs[i], '');
  }

  //split into songs
  songs = rtfText.split('\t');

  //for each song
  currentArtist = "";
  for (var i = 0; i < songs.length; i++) {
    var song = songs[i];
    var arr = song.split('\r\n');

    var title;
    if (arr[0]) {
      title = arr[0].replace('\\par', "").trim();
    }

    var control;
    if (arr[1]) {
      control = arr[1].replace('\\par', "").trim();
    }

    // console.log(control, ": ", title);

    //if it has a weirdo unicode thing
    if (title.indexOf('\\u') > -1) {
      var re = /(\\\uc2.+00)/;

      //check each word
      var words = title.split(' ');
      // console.log(words);
      for (var i = 0; i < words.length; i++) {
        var matches = words[i].match(re);
        if (matches !== null) {
          for (var j = 0; j < matches.length; j++) {
            match = matches[j];

            //build a weird unicode string js knows about
            var matchPieces = match.split('\'');
            var str = '0x'+matchPieces.pop();
            str += matchPieces.pop();
            str = str.slice(0, -1);

            //find the replacement
            replacement = unidecode(String.fromCharCode(str));

            //replace it
            words[i] = words[i].replace(match, replacement);
          }
        }
      }

      //put them back together
      title = words.join(' ');
    }

    if (control && control.substr(-2) == 'b0') {
      currentArtist = title;
    } else {
      var song = {artist: currentArtist, title: title}
      result.push(song);

      if (this.onSong) {
        this.onSong(song);
      }
    }
  }

  cb(result);
};

//I S O M O R P H I C
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = RTFParser;
  }
  exports.RTFParser = RTFParser;
}

