$(function () {
  let editor = ace.edit("rtf-editor");
  editor.renderer.setShowGutter(false);

  let rtfText;
  let ignoreListStrings = [
    "Song List Generator",
    "iphone app!",
    "John Brophy",
    "rare and unique",
    "Printed",
    "Title"
  ];

  let songs = [{artist: "bieber, justin", title: "what do u mean", brand: "BKK"}];
  $("#songbook-table").DataTable({
    pageLength: 100,
    data: songs,
    columns: [{ data: "artist" }, { data: "title" }, { data: "brand" }],
  });

  const fileLabel = $("#songbook-file-label");
  const fileName = $("#songbook-name");

  $("#songbook-refresh").on("click", function (e) {
    parseFile();
  });

  $("#songbook-save").on("click", function (e) {
    toggleLoading();
    let name = fileName.val();
    if (name === "") {
      name = "default name";
    }

    $.ajax({
      type: "POST",
      url: "/songbooks.json",
      data: JSON.stringify({ songbook: { name: name }, songlist: songs }),
      contentType: "application/json",
      success: function (songbook) {
        window.location.href = "/songbooks";
      },
      error: function (data) {
        console.log("error: " + data);
        toggleLoading();
        showAlert("error");
      },
    });
  });

  $("#songbook-file").on("change", function (e) {
    const files = document.getElementById("songbook-file").files;
    const file = files[0];

    if (file) {
      fileLabel.hide();
      fileName.show();

      const reader = new FileReader();

      reader.onload = function (e) {
        rtfText = e.target.result;
        displayIgnoreList();
        parseFile();
      };

      reader.readAsText(file);
    }
  });

  const displayIgnoreList = function () {
    editor.setValue(ignoreListStrings.join("\n"));
  };

  const saveIgnoreList = function () {
    const ignoreListText = editor.getValue();
    ignoreListStrings = ignoreListText.split("\n");
  };

  const parseFile = function () {
    toggleLoading();
    saveIgnoreList();

    let rtfParser = new RTFParser(rtfText);
    rtfParser.ignoredStrings = ignoreListStrings;

    setTimeout(function () {
      rtfParser.parse(function (s) {
        songs = s;
        renderSongbookTable();
        toggleLoading();
      });
    }, 100);
  };

  const renderSongbookTable = function () {
    const dataTable = $("#songbook-table").dataTable();
    if (dataTable) {
      dataTable.fnClearTable();
      dataTable.fnAddData(songs);
    }
  };

  const toggleLoading = function () {
    $("#songbook-save").prop("disabled", function (i, v) {
      return !v;
    });
    $(".spinner").toggle();
    const dataTable = $("#songbook-table").dataTable().api().table();
    if (dataTable) {
      $(dataTable.container()).toggle();
    }
  };

  const showAlert = function (type) {
    const messages = {
      success: "<strong>Success!</strong>",
      error: "<strong>Oh no!</strong> That didn't work. Refresh and try again?",
    };

    const html =
        '<div class="alert alert-' +
        type +
        '">' +
        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
        messages[type] +
        "</div>";

    $(".feedback").append(html);
  };
});
