# frozen_string_literal: true

class Songbook < ApplicationRecord
  belongs_to :user
  has_many :songs, dependent: :delete_all
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

  def search(search_term, search_by, limit)
    search_by.downcase!
    return [] unless %w[title artist brand].include? search_by

    # case insensitive - pg specific
    # search_string = "#{search_by} ilike ?"

    # there has to be a better way to do this
    # terms = search_term.split
    # if terms.length < 1
    #   return []
    # elsif terms.length == 1
    #   songs = self.songs.where(search_string, "%#{terms[0]}%").limit(limit || 1000)
    # elsif terms.length > 1
    #   first_term = terms.shift
    #   songs = self.songs.where(search_string, "%#{first_term}%").limit(limit || 1000)
    #   search_term.split.each do |term|
    #     songs = songs.where(search_string, "%#{term}%").limit(limit || 1000)
    #   end
    # end
    #

    # songs
    Song.find_by_sql(["SELECT artist, title, brand
                        FROM songs
                        WHERE SIMILARITY(#{search_by}, ?) > 0.2
                        AND songbook_id = ?
                        ORDER BY SIMILARITY(#{search_by}, ?) DESC;", search_term, self.id, search_term])
  end
end
