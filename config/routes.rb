Ketten::Application.routes.draw do
  devise_for :users

  get '/json' => 'legacy#json'
  get '/jsonp' => 'legacy#jsonp'
  get '/random' => 'legacy#random'
  get '/stats' => 'legacy#stats'

  resources :songbooks do
    member do
      post :set_default
      post :add_songs
    end
  end

  root :to => 'home#index'
end
