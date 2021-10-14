class Descriptor < ApplicationRecord
    #serialize :face_location, Array
    serialize :face_location
    belongs_to :staff
end
