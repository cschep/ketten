class Songbook < ApplicationRecord
  belongs_to :user
  has_many :songs, :dependent => :delete_all
  validates :name, presence: { message: 'Name cannot be blank.' }

  def create_songs_for_songbook(songlist)
    now = Time.now.utc
    songlist.map do |s|
      s[:songbook_id] = self.id
      s[:created_at] = now
      s[:updated_at] = now
    end

    ActiveRecord::Base.logger.silence do
      Song.insert_all!(songlist)
    end
  end

  def search(search_term, search_by)
    search_term.downcase!
    search_by.downcase!

    search_type = search_by == "title" ? "title" : "artist"
    search_string = "#{search_type} like ?"

    search_term.split.each do |term|
      if @songs.nil?
        @songs = self.songs.where(search_string, "%#{term}%")
      else
        @songs = @songs.where(search_string, "%#{term}%")
      end
    end

    if @songs
      @songs
    else
      self.songs
    end
  end
end
