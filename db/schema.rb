# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_05_04_074932) do

  create_table "descriptors", force: :cascade do |t|
    t.string "face_location"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "staff_id", null: false
    t.index ["staff_id"], name: "index_descriptors_on_staff_id"
  end

  create_table "faces", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "staff_id", null: false
    t.string "face_image"
    t.string "face_descriptor"
    t.index ["staff_id"], name: "index_faces_on_staff_id"
  end

  create_table "facetests", force: :cascade do |t|
    t.string "face_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "staffs", force: :cascade do |t|
    t.string "staff_name"
    t.string "age"
    t.string "phone"
    t.string "department"
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "descriptors", "staffs"
  add_foreign_key "faces", "staffs"
end
