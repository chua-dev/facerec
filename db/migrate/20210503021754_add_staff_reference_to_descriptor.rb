class AddStaffReferenceToDescriptor < ActiveRecord::Migration[6.1]
  def change
    add_reference :descriptors, :staff, null: false, foreign_key: true
  end
end
