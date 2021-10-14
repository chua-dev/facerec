class CreateFaces < ActiveRecord::Migration[6.1]
  def change
    create_table :faces do |t|
      t.string :face_url

      t.timestamps
    end
  end
end
