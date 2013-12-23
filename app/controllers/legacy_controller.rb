
class LegacyController < ApplicationController

  def message_or
    # the_ketten = User.where(:ketten => true).first
    # message = the_ketten.live_message

    fb_url = "https://www.facebook.com/feeds/page.php?format=json&id=58369952922"
    feed = JSON.parse(open(fb_url).read)
    latest = feed['entries'].first
    doc = Nokogiri::HTML(latest['title'])

    link = "<a href=\"#{latest['alternate']}\">more</a>"

    render :json => { :message => "#{doc.to_str} - #{link}" }
  end

  def message_wa
    the_ketten = User.where(:ketten => true).first
    message = the_ketten.live_message

    render :json => { :message => message.content }
  end

  def json
    @songs = searchdb(params[:search], params[:searchby])
    render :json => @songs.to_json(:only => [:artist, :title]), :root => false
  end

  def jsonp
    @songs = searchdb(params[:search], params[:searchby])
    render :json => @songs.to_json(:only => [:artist, :title]), :root => false, :callback => params[:jsoncallback]
  end

  def random
    the_ketten = User.where(:ketten => true).first
    songbook = the_ketten.default_songbook
    @songs = songbook.songs.all(:order => 'random()', :limit => 20)
    render :json => @songs.to_json(:only => [:artist, :title]), :root => false

    Search.create(:search_term => "random", :search_by => "random", :user_agent => request.user_agent, :num_results => @songs.count, :ip_address => request.ip)
  end

  def stats
    @searches = Search.last(100).reverse
  end

  def searchdb(search_term, search_by)
    the_ketten = User.where(:ketten => true).first
    songbook = the_ketten.default_songbook

    puts "searching for #{search_term} by #{search_by} in songbook with id: #{songbook.id} and name: #{songbook.name}"

    @songs = songbook.search(search_term, search_by)

    Search.create(:search_term => search_term,
                  :search_by => search_by,
                  :user_agent => request.user_agent,
                  :num_results => @songs.count,
                  :ip_address => request.ip,
                  :songbook_id => songbook.id)

    @songs
  end
end
