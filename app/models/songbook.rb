require 'songbook_importer'

class Songbook < ActiveRecord::Base
  belongs_to :user
  has_many :songs, :dependent => :delete_all

  #import_status: 0 = importing, 1 = complete, 2 = failed?
  attr_accessible :name, :songbook, :import_status

  mount_uploader :songbook, SongbookUploader

  def self.import_songbook(songbook)
    @song_list = SongbookImporter.import_songs(File.open(songbook.songbook.path))

    songs = []
    @song_list.each do |song|
      songs << Song.new({:artist => song[:artist],
                         :title => song[:title],
                         :songbook_id => songbook.id})
    end

    # the log for this is insanity in dev
    ActiveRecord::Base.logger.level = 1
    Song.import(songs)
    ActiveRecord::Base.logger.level = 0

    songbook.import_status = 1
    songbook.save
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
