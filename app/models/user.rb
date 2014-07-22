class User < ActiveRecord::Base
	#Relationships
	has_many :run_routes


  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :recoverable, :rememberable, 
  			:registerable, :trackable, :validatable

  def get_full_name
  	return "#{self.first_name} #{self.last_name}"
  end 
end