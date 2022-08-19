class RTFParser {
  constructor(rtfText) {
    this.rtfText = rtfText;
    this.ignoredStrings = [];
  }

  parse(cb) {
    let rtfText = this.rtfText;

    let currentArtist = "";
    let currentWord = "";
    let currentControlWord = "";
    let controlWordActive = false;
    let groupActive = false;
    let bold = true;
    let colorGroup = false;
    // NOTE: I don't think this is used anywhere anymore as it was previously used to "soak up"
    //       tabs and apostrophes?
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

    for (var i = 0; i < rtfText.length; i++) {
      let ch = rtfText[i];
      if (garbageChars > 0) {
        garbageChars--;
      } else {
        if (ch === "\n") {
          if (currentWord !== "") {
            if (bold) {
              currentArtist = currentWord.replace("\t", "");
            } else {
              let ignored = this.ignoredStrings.reduce(function (result, ignoredString) {
                return result || currentWord.match(ignoredString);
              }, false);

              if (ignored) {
                continue;
              }

              let parts = currentWord.trim().split("\t(");
              if (currentArtist == "sheeran, ed") {
                console.log(parts, currentWord);
              }

              let title,
                brand = "";
              if (parts.length > 1) {
                title = parts[0];
                brand = parts[1].replace(")", "");
              } else if (parts.length > 0) {
                title = parts[0];
              }

              let song = { artist: currentArtist, title: title, brand: brand };
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
          // } else if (ch === '\'') {
          //   if (controlWordActive) {
          //     controlWordActive = false;
          //     garbageChars = 2;
          //   }
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
    }

    if (cb) {
      cb(result);
    }
  }
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
