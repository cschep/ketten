class AddUserIdToSongbook < ActiveRecord::Migration
  def change
    add_column :songbooks, :user_id, :integer
  end
end
