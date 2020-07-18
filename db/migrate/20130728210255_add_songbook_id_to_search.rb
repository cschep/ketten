class AddSongbookIdToSearch < ActiveRecord::Migration[6.0]
  def change
    add_column :searches, :songbook_id, :integer
  end
end
