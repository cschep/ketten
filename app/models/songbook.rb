class Songbook < ApplicationRecord
  belongs_to :user
  has_many :songs, :dependent => :delete_all
  validates :name, presence: { message: 'Name cannot be blank.' }

  def create_songs_for_songbook(songlist)
    now = Time.now.utc
    songlist.map do |s|
      s[:songbook_id] = id
      s[:created_at] = now
      s[:updated_at] = now
    end

    ActiveRecord::Base.logger.silence do
      Song.insert_all!(songlist)
    end
  end

  def search(search_term, search_by)
    search_by.downcase!
    return [] unless %w[title artist brand].include? search_by

    # case insensitive - pg specific
    search_string = "#{search_by} ilike ?"

    # there has to be a better way to do this
    search_term.split.each do |term|
      current_songs = @songs || songs
      @songs = current_songs.where(search_string, "%#{term}%")
    end

    @songs || songs
  end
end
