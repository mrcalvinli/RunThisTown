class LandingController < ApplicationController
  before_filter :logged_in

  def home
  end

  private
  def logged_in
  	if current_user != nil
  	  redirect_to user_show_path
  	end
  end
end
