class Song < ActiveRecord::Base
  default_scope order('artist')
  belongs_to :songbook

  attr_accessible :artist, :title
end
