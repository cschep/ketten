class AddLiveToMessages < ActiveRecord::Migration
  def change
    add_column :messages, :live, :bool
  end
end
