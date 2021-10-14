class Face < ApplicationRecord
    belongs_to :staff
    validates_associated :staff
    mount_base64_uploader :face_image, FaceimageUploader
    serialize :face_descriptor

    #mount_uploaders :face_url, FaceimageUploader   
    #mount_base64_uploader :face_url, FaceimageUploader
    #validates_uniqueness_of :staff_id, message: "cannot have 2 batch faces registered. You need to delete previous batch before uploading new batch"
    #validates :face_image, :presence => true
    #@response = HTTParty.post('https://prodit12.pythonanywhere.com/process/1', :body => {:data => @base64}.to_json, :headers => {'Content-type' => "application/json"})
end
