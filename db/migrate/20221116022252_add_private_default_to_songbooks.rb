class AddPrivateDefaultToSongbooks < ActiveRecord::Migration[6.1]
  def change
    add_column :songbooks, :private_default, :bool, default: false
  end
end