class AddSongbookIdToSong < ActiveRecord::Migration[6.0]
  def change
    add_column :songs, :songbook_id, :integer
  end
end
