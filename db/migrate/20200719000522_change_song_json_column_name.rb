class ChangeSongJsonColumnName < ActiveRecord::Migration[6.0]
  def change
    rename_column :songbooks, :songs, :songs_json
  end
end
