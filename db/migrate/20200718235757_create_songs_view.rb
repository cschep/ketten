class CreateSongsView < ActiveRecord::Migration[6.0]
  def change
    execute <<-SQL
      CREATE VIEW songs AS
        SELECT s->>'artist' as artist, s->>'title' as title, sb.id as songbook_id
        FROM songbooks as sb, jsonb_array_elements(sb.songs) as s
      SQL
  end
end
