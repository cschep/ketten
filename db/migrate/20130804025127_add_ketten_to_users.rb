# frozen_string_literal: true

class AddKettenToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :ketten, :bool, null: false, default: false
  end
end
