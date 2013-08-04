class AddSongbookIdToSearch < ActiveRecord::Migration
  def change
    add_column :searches, :songbook_id, :integer
  end
end
