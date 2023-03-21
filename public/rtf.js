class RTFParser {
  constructor(rtfText, ignoredStrings) {
    this.rtfText = rtfText;
    this.ignoredStrings = ignoredStrings;
  }

  // The API here is that strings are used by the user
  // and then we turn them into regexes -- there has been
  // confusion over this in the past leading to breakages
  removeIgnoredStrings() {
    let rtfText = this.rtfText;

    for (let ignoredString of this.ignoredStrings) {
      rtfText = rtfText.replace(new RegExp('.*' + ignoredString + '.*', 'g'), '');
    }

    this.rtfText = rtfText;
  };

  parse(cb) {
    // before we even start parsing remove all the ignored strings
    // using regex global replace -- this has been slow in the past
    this.removeIgnoredStrings();

    let rtfText = this.rtfText;
    let currentArtist = "";
    let currentWord = "";
    let currentControlWord = "";
    let controlWordActive = false;
    let groupActive = false;
    let bold = true;
    let colorGroup = false;
    let garbageChars = 0;

    let result = [];

    let unicodeReplacements = {
      u225: "a",
      u228: "a",
      u230: "ae",
      u231: "c",
      u233: "e",
      u237: "i",
      u241: "n",
      u243: "o",
      u246: "o",
      u255: "y",
      u339: "oe",
      u8224: "†",
    };

    function checkControlWord() {
      let colorRegex = /c[f|b]\d/g;
      if (currentControlWord === "b") {
        bold = true;
      } else if (currentControlWord === "b0") {
        bold = false;
      } else if (colorRegex.test(currentControlWord)) {
        colorGroup = true;
      } else if (unicodeReplacements.hasOwnProperty(currentControlWord)) {
        currentWord += unicodeReplacements[currentControlWord];
      }
    }

    // parsing the rtfText character by character
    for (let i = 0; i < rtfText.length; i++) {
      // get the next character
      let ch = rtfText[i];

      // TODO: currently unused because the last use was removing apostrophe's that
      //       we ended up wanting to add back in
      // there are scenarios where garbage chars need to be slurped up and ignored
      // if any of the paths below increase the number above 0 then the next X chars
      // will be effectively ignored
      if (garbageChars > 0) {
        garbageChars--;
        continue;
      }

      // main parsing tree
      // start with a new line
      if (ch === "\n") {
        // a new line means we need to reflect on what we've seen and make a decision
        // if the current word is not empty, and it is bold then that is an artist
        // if it is not bold, then it is a song, so split out the parts and put it in the song queue
        // also fire the onSong callback if it is set
        // finally, set the currentWord back to an empty string
        if (currentWord !== "") {
          if (bold) {
            currentArtist = currentWord.replace("\t", "");
          } else {
            // so we think we have a title, but it might be a tab separated title and brand
            // so we trim it and split it up and check it
            let parts = currentWord.trim().split("\t(");
            let title, brand = "";
            if (parts.length > 1) {
              title = parts[0];
              brand = parts[1].replace(")", "");
            } else if (parts.length > 0) {
              title = parts[0];
            }

            let song = {artist: currentArtist, title: title, brand: brand};
            if (this.onSong) {
              this.onSong(song);
            }

            result.push(song);
          }
        }
        currentWord = "";
      } else if (ch === "\\") {
        if (controlWordActive) {
          checkControlWord();

          currentControlWord = "";
        } else {
          controlWordActive = true;
        }
        // TODO: so we wanted to put apostrophes back in
        //       and also we put tabs back in so we could parse brands if we are there
      } else if (ch === "\t") {
        if (controlWordActive) {
          checkControlWord();
          currentControlWord = "";
          controlWordActive = false;
        } else {
          currentWord += ch;
        }
      } else if (ch === " ") {
        if (controlWordActive) {
          checkControlWord();

          currentControlWord = "";
          controlWordActive = false;
        } else {
          currentWord += ch;
        }
      } else if (ch === "{") {
        groupActive = true;
        currentWord = "";
      } else if (ch === "}") {
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

    if (cb) {
      cb(result);
    }
  }
}

// TODO: investigate es6 modules
// exporting for tests and not breaking the web
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = RTFParser;
  }
  exports.RTFParser = RTFParser;
}

// This is useful!
//
// const fs = require("fs");
// try {
//   const rtfText = fs.readFileSync("/Users/cschep/Downloads/81222.rtf", "utf8");
//   const rtfParser = new RTFParser(rtfText);
//   const ignoredStrings = ["Song List Generator", "iphone app!", "John Brophy", "rare and unique", "Printed", "Title"];
//   rtfParser.ignoredStrings = ignoredStrings;
//   rtfParser.onSong = function (song) {
//     // console.log(song);
//   };
//   rtfParser.parse();
// } catch (err) {
//   console.error(err);
// }
