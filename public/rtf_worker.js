importScripts('/rtf.js');

onmessage = function(e) {
  var rtfText = e.data[0];
  var ignoreListStrings = e.data[1];

  var rtfParser = new RTFParser(rtfText);

  rtfParser.ignoreList = ignoreListStrings.map(function(item) {
    if (item !== '') {
      return new RegExp('.*' + item + '.*', 'g');
    }
  });

  rtfParser.onSong = function(song) {
    postMessage(song);
  };

  rtfParser.parse(function(songs) {
    postMessage(songs);
  });
};
