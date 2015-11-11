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

      song_list = params[:song_list]
      @songbook.create_songs_for_songbook(song_list)

      respond_to do |format|
        format.html { redirect_to :action => "index" }
        format.json { render :json => @songbook }
      end
    else
      flash[:error] = @songbook.errors.full_messages.join(": ")

      respond_to do |format|
        format.html { render :action => "new" }
        format.json { render :json => @songbook.errors }
      end
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
    respond_to do |format|
      format.html { render :action => "show" }
      format.json { render :json => { data: @songbook.songs } }
    end
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
