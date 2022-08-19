# frozen_string_literal: true

class CreateSongs < ActiveRecord::Migration[6.0]
  def change
    create_table :songs do |t|
      t.text :artist
      t.text :title
      t.references :songbook, null: false, foreign_key: true

      t.timestamps
    end
  end
end
