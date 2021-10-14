Rails.application.routes.draw do
  resources :facetests
  resources :faces
  resources :staffs
  get 'registration/index'
  get 'identification/index'
  root 'home#index'

  get 'descriptor', :to => 'faces#descriptor'
  post 'new_descriptor', :to => 'faces#new_descriptor'

  delete 'delete_descriptor\:id', :to => 'faces#delete_descriptor', :as => 'delete_descriptor'
end
