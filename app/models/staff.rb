class Staff < ApplicationRecord
    has_many :faces, dependent: :destroy
    has_many :descriptors, dependent: :destroy
    #validates_length_of :faces, maximum: 5
end
