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
      flash[:notice] = "Successfully created songbook."

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

  def add_songs
    # @songbook = Songbook.find_by_id(params[:id])
    # puts "adding to #{@songbook}"
    # songs_json = request.raw_post
    # puts songs_json
    # @songbook.songs_json = songs_json

    query = <<-SQL
      UPDATE "songbooks" SET "songs_json" = '#{request.raw_post}' WHERE "songbooks"."id" = #{params[:id]}
    SQL
    result = ActiveRecord::Base.connection.execute(query)
    puts result

    # if @songbook.save
    #   flash[:notice] = "Successfully created songbook."

    #   respond_to do |format|
    #     format.html { redirect_to :action => "index" }
    #     format.json { render :json => @songbook }
    #   end
    # else
    #   flash[:error] = @songbook.errors.full_messages.join(": ")

    #   respond_to do |format|
    #     format.html { render :action => "new" }
    #     format.json { render :json => @songbook.errors }
    #   end
    # end
  end

  def edit
  end

  def destroy
    @songbook = Songbook.find_by_id(params[:id])
    @songbook.destroy

    redirect_back(fallback_location: root_path)
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

    redirect_back(fallback_location: root_path)
  end

private
  def songbook_params
    params.require(:songbook).permit(:name)
  end
end
