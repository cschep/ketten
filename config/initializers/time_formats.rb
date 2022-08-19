# frozen_string_literal: true

Time::DATE_FORMATS[:month_and_year] = '%B %Y'
Time::DATE_FORMATS[:pretty] = ->(time) { time.strftime('%a, %b %e at %l:%M') + time.strftime('%p').downcase }
