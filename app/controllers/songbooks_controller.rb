class SongbooksController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_songbooks_for_user, :only => [:index]

  def index
  end

  def new
  end

  def create
  end

  def show
    @songbook = Songbook.find_by_id(params[:id])
  end

  def load_songbooks_for_user
    @songbooks = current_user.songbooks
  end
end
