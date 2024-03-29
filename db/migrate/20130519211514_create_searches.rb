# frozen_string_literal: true

class CreateSearches < ActiveRecord::Migration[6.0]
  def change
    create_table :searches do |t|
      t.string :search_term
      t.string :search_by
      t.string :user_agent
      t.integer :num_results
      t.string :ip_address
      t.references :songbook

      t.timestamps
    end
  end
end
