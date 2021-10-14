class AddColumnsToFace < ActiveRecord::Migration[6.1]
  def change
    add_column :faces, :facelabel_front, :string
    add_column :faces, :facelabel_left, :string
    add_column :faces, :facelabel_right, :string
    add_column :faces, :facelabel_up, :string
    add_column :faces, :facelabel_down, :string
  end
end
