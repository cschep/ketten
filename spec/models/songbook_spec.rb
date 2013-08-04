require 'spec_helper'

describe Songbook do
  let(:songbook) {
    Songbook.create()
  }

  let(:request) {
    double(:user_agent => "fake user agent", :ip => "10.0.0.1")
  }

  it "should do search right" do
    # songbook.songs.create({:artist => "farts", :title => "butts"})

    # songbook.search('farts', 'artist')
  end

end
