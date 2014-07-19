module LandingHelper

  # Date options for the sign up module
  def date_options
    { :start_year => Date.today.year - 100 }
  end
end
