class SongbookImporter

  class << self

    def import_songs(file)
      result = []
      is_artist = false

      current_artist = ""
      file.each do |line|
        if line.include? "John Brophy" or line.include? "babyketten.com" or line.include? "{" or line.include? "}" then next end
        words = line.split("\t")

        words.each do |word|
          aword = word.split("  ")

          if aword.length == 2
            if aword[0][-2,2] == '\b'
              is_artist = true
            elsif aword[0][-2,2] == 'b0'
              is_artist = false
            end

            word = aword[1]
          end

          if word.chop.chomp[-2..-1] == '\b'
            is_artist = true
          elsif word.chop.chomp[-2..-1] == 'b0'
            is_artist = false
          end

          if not (word.include? "\\pard\\" or word.include? "baby ketten" or word.include? "Brophy" or word.include? "ketten.com")
            if word.include? "\\par" then word.chomp!.sub!('\\par', "") end #take the line endings off the words
            if is_artist
              current_artist = rtf_render(word)
            else
              result.push({:artist => current_artist, :title => rtf_render(word)})
           end
         end
        end
      end

      result
    end

    def write_to_db(song_list)
      Song.delete_all
      song_list.each do |entry|
        Song.new(entry).save()
      end
    end

    @@rtf_replacements = {
      "\\uc2\\u246\\'F6\\'00"   => "o",
      "\\uc2\\u246\\''F6\\''00" => "o",
      "\\uc2\\u233\\'E9\\'00"   => "e",
      "\\uc2\\u233\\''E9\\''00" => "e",
      "\\uc2\\u243\\''F3\\''00" => "o",
      "\\uc2\\u241\\'F1\\'00"   => "n",
      "\\uc2\\u243\\'F3\\'00"   => "o",
      "\\uc2\\u241\\''F1\\''00" => "n",
      "\\uc2\\u231\\'E7\\'00"   => "c",
      "\\uc2\\u230\\'E6\\'00"   => "ae",
      "\\uc2\\u339\\'53\\'01"   => "oe",
      "\\uc2\\u228\\'E4\\'00l"  => "a",
      "\\uc2\\u225\\'E1\\'00n"  => "a",
      "\\uc2\\u237\\'ED\\'00t"  => "i",
      "\\uc2\\u255\\'FF\\'00"   => "y"
    }

    def rtf_render(original)
      original.gsub(/\\uc2\S*'00?./) do |s|
        #this is a bit hacky - save the last char here.
        last_char = s[-1,1]
        chopped = false

        #check to see if the replacement exists with the last char if not chop it.
        if @@rtf_replacements[s].nil?
          s.chop!
          chopped = true
        end

        #do the check again, if it got chopped, add the last_char back on after replacing.
        unless @@rtf_replacements[s].nil?
          if chopped
            @@rtf_replacements[s] + last_char
          else
            @@rtf_replacements[s]
          end
        end
      end
    end
  end

end
