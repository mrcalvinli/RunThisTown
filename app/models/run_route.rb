class RunRoute < ActiveRecord::Base
	#Relationship
	belongs_to :user

	#Serializing text into array for Locations in mysql
	serialize :locations, Array

	#The data structure that represents a location in the array of locations in route
	#Location Info = {name, {latitude, longitude}}
	LocCoord = Struct.new(:latitude, :longitude)
	LocInfo = Struct.new(:address, :coord)

	def add_location(address, latitude, longitude)
		self.locations.push(LocInfo.new(address, LocCoord.new(latitude, longitude)))
		return true
	end
end
