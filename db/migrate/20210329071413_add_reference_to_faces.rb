class AddReferenceToFaces < ActiveRecord::Migration[6.1]
  def change
    add_reference :faces, :staff, null: false, foreign_key: true
  end
end
