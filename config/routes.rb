Rails.application.routes.draw do
  namespace :api, { format: 'json' } do
    namespace :v1 do
      get '/current_user_information' => 'application#current_user_information'

      get '/auth/:provider/callback' => 'sessions#create'
      get '/logout' => 'sessions#destroy'
    end
  end
end
