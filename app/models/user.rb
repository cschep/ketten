# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :songbooks
  has_many :messages

  def full_name
    "#{first_name} #{last_name}"
  end

  def default_songbook
    songbooks.where(default: true).first
  end

  def live_message
    messages.where(live: true).first
  end
end
