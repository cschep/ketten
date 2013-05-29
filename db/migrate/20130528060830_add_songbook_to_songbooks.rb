class AddSongbookToSongbooks < ActiveRecord::Migration
  def change
    add_column :songbooks, :songbook, :string
  end
end
