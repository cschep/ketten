class AddImportStatusToSongbook < ActiveRecord::Migration[6.0]
  def change
    add_column :songbooks, :import_status, :int, :default => 0
  end
end
