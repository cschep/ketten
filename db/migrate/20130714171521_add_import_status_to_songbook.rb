class AddImportStatusToSongbook < ActiveRecord::Migration
  def change
    add_column :songbooks, :import_status, :int, :default => 0
  end
end
