class SongbooksController < ApplicationController
  before_filter :authenticate_user!

  def index
    @songbooks = current_user.songbooks
  end

  def new
    @songbook = Songbook.new
  end

  def create
    @songbook = current_user.songbooks.build(params[:songbook])
    if @songbook.save
      flash[:notice] = "Successfully created songbook."

      # Songbook.delay.import_songbook(@songbook)

      redirect_to :action => "index"
    else
      flash[:error] = @songbook.errors.full_messages.join(": ")

      render :action => "new"
    end
  end

  def edit
  end

  def destroy
    @songbook = Songbook.find_by_id(params[:id])
    @songbook.destroy

    redirect_to :back
  end

  def show
    @songbook = Songbook.find_by_id(params[:id])

    if params[:search]
      @songs = @songbook.search(params[:search], params[:search_by])
    else
      @songs = @songbook.songs
    end

    @songs = @songs.paginate(:page => params[:page], :per_page => 100)
  end

  def set_default
    @songbook = Songbook.find_by_id(params[:id])
    current_user.songbooks.each do |sb|
      if sb == @songbook
        sb.default = true
      else
        sb.default = false
      end

      sb.save
    end

    redirect_to :back
  end
end
