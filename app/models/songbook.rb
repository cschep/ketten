class Songbook < ActiveRecord::Base
  belongs_to :user
  has_many :songs

  attr_accessible :name, :songbook

  mount_uploader :songbook, SongbookUploader
end
