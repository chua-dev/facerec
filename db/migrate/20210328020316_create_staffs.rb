class CreateStaffs < ActiveRecord::Migration[6.1]
  def change
    create_table :staffs do |t|
      t.string :staff_name
      t.string :age
      t.string :phone
      t.string :department
      t.string :email

      t.timestamps
    end
  end
end
