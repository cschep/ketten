class AddUserIdToSongbook < ActiveRecord::Migration[6.0]
  def change
    add_column :songbooks, :user_id, :integer
  end
end
