# frozen_string_literal: true

# this powers the search for the app and the book.babyketten.com website
# basically all the real uses
# needs cleanup according to rubocop!
class LegacyController < ApplicationController
  protect_from_forgery except: :jsonp

  def json
    @songs = searchdb(params[:search], params[:searchby], params[:db], params[:live])
    render json: @songs.to_json(only: %i[artist title brand]), root: false
  end

  def jsonp
    @songs = searchdb(params[:search], params[:searchby], params[:db], params[:live])
    render json: @songs.to_json(only: %i[artist title brand]), root: false, callback: params[:jsoncallback]
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def random
    the_ketten = User.where(ketten: true).first
    if the_ketten&.default_songbook('public')
      songbook = the_ketten.default_songbook('public')
      @songs = songbook.songs.order('random()').limit(20)
      render json: @songs.to_json(only: %i[artist title brand]), root: false

      Search.create(
        search_term: 'random',
        search_by: 'random',
        user_agent: request.user_agent,
        num_results: @songs.count,
        ip_address: request.ip,
        songbook_id: songbook.id
      )
    else
      render json: [].to_json, root: false
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def stats
    @searches = Search.last(100).reverse
  end

  # rubocop:disable Metrics/MethodLength
  def searchdb(search_term, search_by, db, live)
    songs = []

    if search_by && search_term
      the_ketten = User.where(ketten: true).first

      if the_ketten&.default_songbook(db)
        songbook = the_ketten.default_songbook(db)

        if live == 'true'
          songs = songbook.search(search_term, search_by, 25)
        else
          songs = songbook.search(search_term, search_by, 1000)
          Search.create(
            search_term:,
            search_by:,
            user_agent: request.user_agent,
            num_results: songs.count,
            ip_address: request.ip,
            songbook_id: songbook.id
          )
        end
      end
    end

    songs
  end
  # rubocop:enable Metrics/MethodLength
end
