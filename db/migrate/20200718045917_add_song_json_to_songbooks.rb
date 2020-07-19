class AddSongJsonToSongbooks < ActiveRecord::Migration[6.0]
  def change
    add_column :songbooks, :songs, :jsonb, null: false, default: []
  end
endr