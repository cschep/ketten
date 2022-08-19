class AddBrandToSongs < ActiveRecord::Migration[6.1]
  def change
    add_column :songs, :brand, :string, null: false, default: ''
  end
end
