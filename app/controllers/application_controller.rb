# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery

  def after_sign_in_path_for(_resource)
    songbooks_path
  end
end
