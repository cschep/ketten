class AddSongbookIdToSong < ActiveRecord::Migration
  def change
    add_column :songs, :songbook_id, :integer
  end
end
