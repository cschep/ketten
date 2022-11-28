class AddGinIndexesToSongs < ActiveRecord::Migration[6.1]
  def up
    execute "CREATE INDEX songs_artist_trgm_idx ON songs USING GIN (artist gin_trgm_ops);"
    execute "CREATE INDEX songs_title_trgm_idx ON songs USING GIN (title gin_trgm_ops);"
  end

  def down
    execute "DROP INDEX songs_artist_trgm_idx"
    execute "DROP INDEX songs_title_trgm_idx"
  end
end
