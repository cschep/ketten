class LegacyController < ApplicationController
  protect_from_forgery except: :jsonp

  def json
    @songs = searchdb(params[:search], params[:searchby])
    render json: @songs.to_json(only: %i[artist title brand]), root: false
  end

  def jsonp
    @songs = searchdb(params[:search], params[:searchby])
    render :json => @songs.to_json(:only => [:artist, :title, :brand]), :root => false, :callback => params[:jsoncallback]
  end

  def random
    the_ketten = User.where(:ketten => true).first
    if the_ketten && the_ketten.default_songbook
      songbook = the_ketten.default_songbook
      @songs = songbook.songs.order('random()').limit(20)
      render :json => @songs.to_json(:only => [:artist, :title, :brand]), :root => false

      Search.create(:search_term => "random", :search_by => "random", :user_agent => request.user_agent, :num_results => @songs.count, :ip_address => request.ip, :songbook_id => songbook.id)
    else
      render :json => [].to_json(), :root => false
    end
  end

  def stats
    @searches = Search.last(100).reverse
  end

  def searchdb(search_term, search_by)
    @songs = []

    if search_by && search_term
      the_ketten = User.where(:ketten => true).first
      if the_ketten && the_ketten.default_songbook
        songbook = the_ketten.default_songbook

        @songs = songbook.search(search_term, search_by)

        Search.create(:search_term => search_term,
                      :search_by => search_by,
                      :user_agent => request.user_agent,
                      :num_results => @songs.count,
                      :ip_address => request.ip,
                      :songbook_id => songbook.id)
      end
    end

    @songs
  end
end
