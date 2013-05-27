class Songbook < ActiveRecord::Base
  belongs_to :user
  has_many :songs

  attr_accessible :name
end
