class RemoveFaceUrlFromFace < ActiveRecord::Migration[6.1]
  def change
    remove_column :faces, :face_url, :string
    remove_column :faces, :facelabel_front, :string
    remove_column :faces, :facelabel_left, :string
    remove_column :faces, :facelabel_right, :string
    remove_column :faces, :facelabel_up, :string
    remove_column :faces, :facelabel_down, :string
  end
end
