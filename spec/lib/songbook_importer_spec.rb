require_relative "../../lib/songbook_importer"

describe SongbookImporter do

  it "should parse rtf content into an array of songs dicts" do
    @csv_file_path = ("spec/file_fixtures/test_data.rtf")

    song_list = SongbookImporter.import_songs(open(@csv_file_path))
    song_list.count.should == 31451
  end

  it "should replace weird rtf characters" do
    test_strings = ["the girl & the robot (spencer & hill remix) (with r\\uc2\\u246\\'F6\\'00yksopp)",
                    "bj\\uc2\\u246\\'F6\\'00rk"]

    test_results = ["the girl & the robot (spencer & hill remix) (with royksopp)", "bjork"]

    test_strings.each_with_index do |s, i|
      SongbookImporter.rtf_render(s).should == test_results[i]
    end
  end

end
