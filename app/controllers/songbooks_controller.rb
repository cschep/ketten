class SongbooksController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_songbooks_for_user, :only => [:index]

  def index
  end

  def new
    @songbook = Songbook.new
  end

  def create
    @songbook = Songbook.new(params[:songbook])
    if @songbook.save
      flash[:notice] = "Successfully created songbook."
      redirect_to @songbook
    else
      render :action => 'new'
    end
  end

  def edit
  end

  def destroy
    @songbook = Songbook.new(params[:songbook])
    
  end

  def show
    @songbook = Songbook.find_by_id(params[:id])
  end

  # silly?
  def load_songbooks_for_user
    @songbooks = current_user.songbooks
  end
end
