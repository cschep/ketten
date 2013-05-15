class CreateSongbooks < ActiveRecord::Migration
  def change
    create_table :songbooks do |t|
      t.string :name

      t.timestamps
    end
  end
end
