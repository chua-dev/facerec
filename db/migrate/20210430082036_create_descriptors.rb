class CreateDescriptors < ActiveRecord::Migration[6.1]
  def change
    create_table :descriptors do |t|
      t.string :face_location, array: true #, :precision => 15, :scale => 13

      t.timestamps
    end
  end
end
