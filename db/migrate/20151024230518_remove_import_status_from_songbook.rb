class RemoveImportStatusFromSongbook < ActiveRecord::Migration
  def up
    remove_column :songbooks, :import_status
  end

  def down
    add_column :songbooks, :import_status, :int
  end
end