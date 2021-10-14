class CreateFacetests < ActiveRecord::Migration[6.1]
  def change
    create_table :facetests do |t|
      t.string :face_url

      t.timestamps
    end
  end
end
