class AddKettenToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :ketten, :bool
  end
end
