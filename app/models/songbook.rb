class Songbook < ActiveRecord::Base
  belongs_to :user
  has_many :songs, :dependent => :delete_all
  validates :name, :presence => {:message => 'Name cannot be blank.'}

  #import_status: 0 = importing, 1 = complete, 2 = failed?
  attr_accessible :name, :songbook, :import_status

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
