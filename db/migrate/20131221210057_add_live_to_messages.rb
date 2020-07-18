class AddLiveToMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :messages, :live, :bool
  end
end
