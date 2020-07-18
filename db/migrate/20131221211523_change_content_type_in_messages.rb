class ChangeContentTypeInMessages < ActiveRecord::Migration[6.0]
  def up
    change_column :messages, :content, :text
  end

  def down
    change_column :messages, :content, :string
  end
end
