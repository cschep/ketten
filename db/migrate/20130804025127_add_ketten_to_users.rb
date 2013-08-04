class AddKettenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :ketten, :bool
  end
end
