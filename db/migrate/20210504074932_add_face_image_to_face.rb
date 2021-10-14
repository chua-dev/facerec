class AddFaceImageToFace < ActiveRecord::Migration[6.1]
  def change
    add_column :faces, :face_image, :string
    add_column :faces, :face_descriptor, :string
  end
end
