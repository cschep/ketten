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

  var songs = [{artist: 'bieber, justin', title: 'so hot right now'}];
  $('#songbook-table').DataTable({
    pageLength: 100,
    data: songs,
    columns: [
      { data: "artist" },
      { data: "title" }
    ]
  });

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
    toggleLoading();
    saveIgnoreList();

    if (window.Worker) {
      console.log('Web workers detected.. engage.');

      //TODO: just make the one worker and postMessage starts a job. Would that even help?
      rtfWorker = new Worker('/rtf_worker.js');
      rtfWorker.onmessage = function(e) {
        songs = e.data;
        renderSongbookTable();
        toggleLoading();
      }
      rtfWorker.postMessage([rtfText, ignoreListStrings]);

    } else {
      console.log('uh oh, web workers not enabled.');
    }
  };

  var renderSongbookTable = function() {
    var dataTable = $('#songbook-table').dataTable();
    if (dataTable) {
      dataTable.fnClearTable();
      dataTable.fnAddData(songs);
    }
  };

  var toggleLoading = function() {
    console.log('loading toggled');
    $('.spinner').toggle();
    var dataTable = $('#songbook-table').dataTable().api().table();
    if (dataTable) {
      $(dataTable.container()).toggle();
    }
  };

});
