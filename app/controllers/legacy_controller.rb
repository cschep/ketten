
class LegacyController < ApplicationController

  def json
    @songs = searchdb(params[:search], params[:searchby])
    render :json => @songs.to_json(:only => [:artist, :title]), :root => false
  end

  def jsonp
    @songs = searchdb(params[:search], params[:searchby])
    render :json => @songs.to_json(:only => [:artist, :title]), :root => false, :callback => params[:jsoncallback]
  end

  def random
    @songs = Song.all(:order => 'random()', :limit => 20)
    render :json => @songs.to_json(:only => [:artist, :title]), :root => false
  end

  def stats
    @searches = Search.last(100).reverse
  end

  def searchdb(search_term, search_by)
    search_term.downcase!
    if search_term.size < 2 then return "".to_json end #1 char searches are slow, this feels hacky though.

    if search_by == 'artist' or search_by == 'Artist'
      search_term.split.each do |term|
        if @songs.nil?
          @songs = Song.all(:conditions => ["artist like ?", "%#{term}%"])
        else
          @songs = @songs & Song.all(:conditions => ["artist like ?", "%#{term}%"])
        end
      end
    else
      search_term.split.each do |term|
        if @songs.nil?
          @songs = Song.all(:conditions => ["title like ?", "%#{term}%"])
        else
          @songs = @songs & Song.all(:conditions => ["title like ?", "%#{term}%"])
        end
      end
    end

    Search.create(:search_term => search_term, :search_by => search_by, :user_agent => request.user_agent, :num_results => @songs.count, :ip_address => request.ip)

    @songs
  end
end
