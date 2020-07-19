$(function() {
  var editor = ace.edit('rtf-editor');
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

  var songs = [{artist: 'bieber, justin', title: 'what do u mean'}];
  $('#songbook-table').DataTable({
    pageLength: 100,
    data: songs,
    columns: [
      { data: 'artist' },
      { data: 'title' }
    ]
  });

  var fileLabel = $('#songbook-file-label');
  var fileName = $('#songbook-name');
  var songbookTableBody = $('#songbook-table-body');

  $('#songbook-refresh').on('click', function(e) {
    parseFile();
  });

  $('#songbook-stop').on('click', function(e) {
    rtfWorker.terminate();
  });

  $('#songbook-save').on('click', function(e) {
    toggleLoading();
    var name = fileName.val();
    if (name === '') {
      name = 'default name';
    }

    $.ajax({
      type: 'POST',
      url: '/songbooks.json',
      data: JSON.stringify({ songbook: { name: name, songs_json: songs } }),
      contentType: 'application/json',
      success: function(data) {
        window.location.href = '/songbooks';
      },
      error: function(data) {
        console.log('error: ' + data);
        toggleLoading();
        showAlert('error');
      }
    });
  });

  $('#songbook-file').on('change', function(e) {
    var files = document.getElementById('songbook-file').files;
    var file = files[0];

    if (file) {
      fileLabel.hide();
      fileName.show();

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
    if (window.Worker) {
      console.log('Web workers detected.. engage.');
      toggleLoading();
      saveIgnoreList();

      //TODO: just make the one worker and postMessage starts a job. Would that even help?
      rtfWorker = new Worker('/rtf_worker.js');
      rtfWorker.onmessage = function(e) {
        songs = e.data;
        renderSongbookTable();
        toggleLoading();
      }
      rtfWorker.postMessage([rtfText, ignoreListStrings]);

    } else {
      showAlert('error');
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
    $('#songbook-save').prop('disabled', function(i, v) { return !v; });
    $('.spinner').toggle();
    var dataTable = $('#songbook-table').dataTable().api().table();
    if (dataTable) {
      $(dataTable.container()).toggle();
    }
  };

  var showAlert = function(type) {
    var messages = {
      'success': '<strong>Success!</strong>',
      'error': '<strong>Oh no!</strong> That didn\'t work. Refresh and try again?'
    }

    var html = '<div class="alert alert-' + type + '">' +
                  '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                  messages[type] +
               '</div>';

    $('.feedback').append(html);
  };

});
