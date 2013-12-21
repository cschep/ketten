class MessagesController < ApplicationController
  before_filter :authenticate_user!

  def index
    @messages = Message.all
  end

  def new
    @message = Message.new
  end

  def create
    @message = current_user.messages.build(params[:message])
    @message.save

    redirect_to messages_path
  end

  def destroy
    @message = Message.find_by_id(params[:id])
    @message.destroy

    redirect_to :back
  end

  def set_live
    @message = Message.find_by_id(params[:id])
    current_user.messages.each do |m|
      if m == @message
        m.live = true
      else
        m.live = false
      end

      m.save
    end

    redirect_to :back
  end
end
