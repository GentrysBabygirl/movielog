require 'simplecov'
SimpleCov.start do
  add_filter '/vendor/'
end

require 'bundler/setup'
Bundler.require

require 'rspec'

require_relative '../movielog/movielog'
require 'movie_db/rspec'

RSpec.configure do |config|
  config.order = 'random'
end

require 'fakeweb'
FakeWeb.allow_net_connect = false
