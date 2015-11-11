Ketten::Application.routes.draw do
  devise_for :users

  match '/json' => 'legacy#json'
  match '/jsonp' => 'legacy#jsonp'
  match '/random' => 'legacy#random'
  match '/stats' => 'legacy#stats'

  resources :songbooks do
    member do
      post :set_default
    end
  end

  root :to => 'home#index'
end
