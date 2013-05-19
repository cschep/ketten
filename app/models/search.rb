class Search < ActiveRecord::Base
  attr_accessible :num_results, :ip_address, :search_by, :search_term, :user_agent
end
