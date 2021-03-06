class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # Add more required parameters for devise
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up).push(:first_name, :last_name, :birthday)
  end

  def after_sign_in_path_for(resource)
    user_show_path
  end

  def after_sign_out_path_for(resource)
    root_path
  end
end
