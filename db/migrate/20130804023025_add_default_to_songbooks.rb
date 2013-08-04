class AddDefaultToSongbooks < ActiveRecord::Migration
  def change
    add_column :songbooks, :default, :bool
  end
end
