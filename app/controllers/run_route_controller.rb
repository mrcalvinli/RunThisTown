class RunRouteController < ApplicationController
  def new
  end

  def create
  	#Create route
  	@route = RunRoute.new
  	@route.user_id = current_user.id
  	@route.name = params[:name]
		@route.distance = params[:distance]
  	params[:locations].each do |loc|
  		locJson = JSON.parse(loc)
  		@route.add_location(locJson["address"], locJson["latitude"], locJson["longitude"])
  	end

  	@route.save
  	redirect_to user_show_path
  end

  def show
  end

  def edit
  end
end
