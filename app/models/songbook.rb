class Songbook < ApplicationRecord
  belongs_to :user
  has_many :songs
  validates :name, presence: { message: 'Name cannot be blank.' }

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
