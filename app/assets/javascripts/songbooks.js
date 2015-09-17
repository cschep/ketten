$(function() {
  var editor = ace.edit("rtf-editor");
  editor.renderer.setShowGutter(false);

  var rtfText;
  var rtfParser;
  var ignoreListStrings = [
    'Song List Generator',
    'iphone app!',
    'John Brophy',
    'rare and unique',
    'BKK',
    'Printed',
    'Title'
  ];

  var fileLabel = $('#songbook-file-label');
  var songbookTableBody = $('#songbook-table-body');

  $('#songbook-refresh').on('click', function(e) {
    parseFile();
  });

  $('#songbook-file').on('change', function(e) {
    var files = document.getElementById("songbook-file").files;
    var file = files[0];

    if (file) {
      fileLabel.html(file.name);

      var reader = new FileReader();

      reader.onload = function(e) {
        rtfText = e.target.result;

        rtfParser = new RTFParser(rtfText);
        saveIgnoreList();
        displayIgnoreList();

        rtfParser.onSong = function(song) {
          var songRow = '<tr><td>' + song.artist + '</td><td>' + song.title + '</td></tr>';
          songbookTableBody.append(songRow);
        };

        parseFile();
      };

      reader.readAsText(file);
    }
  });

  var displayIgnoreList = function() {
    var ignoreListText = ignoreListStrings.join('\n');
    editor.setValue(ignoreListText);
  };

  var saveIgnoreList = function() {
    var ignoreListText = editor.getValue();
    var ignoreList = ignoreListText.split('\n');

    rtfParser.ignoreList = ignoreList.map(function(item) {
      return new RegExp('.*' + item + '.*', 'g');
    });
  };

  var parseFile = function() {
    songbookTableBody.html('');
    saveIgnoreList();

    rtfParser.parse();
  };
});
