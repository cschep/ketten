class AddSongbookToSongbooks < ActiveRecord::Migration[6.0]
  def change
    add_column :songbooks, :songbook, :string
  end
end
