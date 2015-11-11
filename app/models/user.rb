class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :songbooks
  has_many :messages

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me,
                  :first_name, :last_name

  def full_name
    "#{first_name} #{last_name}"
  end

  def default_songbook
    self.songbooks.where(:default => true).first
  end

  def live_message
    self.messages.where(:live => true).first
  end
end
