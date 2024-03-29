# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += %i[password songlist]

# for sql logging
module LogTruncater
  def render_bind(attr, value)
    num_chars = begin
      Integer(ENV['ACTIVERECORD_SQL_LOG_MAX_VALUE'])
    rescue StandardError
      120
    end
    half_num_chars = num_chars / 2

    if attr.is_a?(Array)
      attr = attr.first
    elsif attr.type.binary? && attr.value
      value = "<#{attr.value_for_database.to_s.bytesize} bytes of binary data>"
    end

    if value.is_a?(String) && value.size > num_chars
      value = "#{value[0,
                       half_num_chars]} [REDACTED #{value.size - num_chars} chars] #{value[-half_num_chars,
                                                                                           half_num_chars]}"
    end

    [attr&.name, value]
  end
end

module ActiveRecord
  class LogSubscriber
    prepend LogTruncater
  end
end
