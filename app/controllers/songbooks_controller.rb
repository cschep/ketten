# frozen_string_literal: true

class SongbooksController < ApplicationController
  before_action :authenticate_user!

  def index
    @songbooks = current_user.songbooks
  end

  def new
    @songbook = Songbook.new
  end

  def create
    @songbook = current_user.songbooks.build(songbook_params)

    if @songbook.save
      flash[:notice] = 'Successfully created songbook.'

      @songbook.create_songs_for_songbook(params[:songlist])

      respond_to do |format|
        format.html { redirect_to action: 'index' }
        format.json { render json: @songbook }
      end
    else
      flash[:error] = @songbook.errors.full_messages.join(': ')

      respond_to do |format|
        format.html { render action: 'new' }
        format.json { render json: @songbook.errors }
      end
    end
  end

  def edit; end

  def destroy
    @songbook = Songbook.find_by_id(params[:id])
    @songbook.destroy

    redirect_back(fallback_location: root_path)
  end

  def show
    @songbook = Songbook.find_by_id(params[:id])
    respond_to do |format|
      format.html { render action: 'show' }
      format.json { render json: { data: @songbook.songs } }
    end
  end

  def set_default
    @songbook = Songbook.find_by_id(params[:id])
    current_user.songbooks.each do |sb|
      sb.default = sb == @songbook

      sb.save
    end

    redirect_back(fallback_location: root_path)
  end

  private

  def songbook_params
    params.require(:songbook).permit(:name)
  end
end
