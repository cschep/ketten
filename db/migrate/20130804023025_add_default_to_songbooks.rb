# frozen_string_literal: true

class AddDefaultToSongbooks < ActiveRecord::Migration[6.0]
  def change
    add_column :songbooks, :default, :bool
  end
end
