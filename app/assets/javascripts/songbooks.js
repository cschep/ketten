$(function() {
  var editor = ace.edit("rtf-editor");
  editor.renderer.setShowGutter(false);

  var rtfWorker;
  var rtfText;
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

  $('#songbook-stop').on('click', function(e) {
    rtfWorker.terminate();
  });

  $('#songbook-file').on('change', function(e) {
    var files = document.getElementById("songbook-file").files;
    var file = files[0];

    if (file) {
      fileLabel.html(file.name);

      var reader = new FileReader();

      reader.onload = function(e) {
        rtfText = e.target.result;
        displayIgnoreList();
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
    ignoreListStrings = ignoreListText.split('\n');
  };

  var parseFile = function() {
    songbookTableBody.html('');
    saveIgnoreList();

    if (window.Worker) {
      console.log('Web workers detected.. engage.');

      rtfWorker = new Worker('/rtf_worker.js');
      rtfWorker.onmessage = function(e) {
        var songs = e.data;
        var songTableData = '';
        songs.forEach(function(song) {
          var songRow = '<tr><td>' + song.artist + '</td><td>' + song.title + '</td></tr>';
          songTableData += songRow;
        });
        songbookTableBody.html(songTableData);
      }
      rtfWorker.postMessage([rtfText, ignoreListStrings]);

    } else {
      console.log('uh oh, web workers not enabled.');
    }
  };
});
