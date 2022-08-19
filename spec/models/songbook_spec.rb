# frozen_string_literal: true

require 'spec_helper'

describe Songbook do
  let(:songbook) do
    Songbook.create
  end

  let(:request) do
    double(user_agent: 'fake user agent', ip: '10.0.0.1')
  end

  it 'should do search right' do
    # songbook.songs.create({:artist => "farts", :title => "butts"})

    # songbook.search('farts', 'artist')
  end
end
