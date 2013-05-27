class Song < ActiveRecord::Base
  belongs_to :songbook

  attr_accessible :artist, :title
end
