class Songbook < ActiveRecord::Base
  belongs_to :user
  has_many :songs, :dependent => :delete_all
  validates :name, :presence => {:message => 'Name cannot be blank.'}

  attr_accessible :name, :songbook

  def create_songs_for_songbook(song_list)
    songs = []
    song_list.each do |song|
      songs << Song.new({:artist => song[:artist],
                         :title => song[:title],
                         :songbook_id => self.id})
    end

    # the log for this is insanity in dev
    ActiveRecord::Base.logger.level = 1
    Song.import(songs)
    ActiveRecord::Base.logger.level = 0
  end

  def search(search_term, search_by)
    search_term.downcase!
    search_by.downcase!

    search_type = "artist"
    if search_by == "title"
      search_type = "title"
    end

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
