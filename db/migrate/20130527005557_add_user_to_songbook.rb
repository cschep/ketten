class AddUserToSongbook < ActiveRecord::Migration[6.0]
  def change
    add_reference :songbooks, :user, foreign_key: true
  end
end
