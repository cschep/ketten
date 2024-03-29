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

ActiveRecord::Schema.define(version: 2022_11_22_211945) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "plpgsql"

  create_table "searches", force: :cascade do |t|
    t.string "search_term"
    t.string "search_by"
    t.string "user_agent"
    t.integer "num_results"
    t.string "ip_address"
    t.bigint "songbook_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["songbook_id"], name: "index_searches_on_songbook_id"
  end

  create_table "songbooks", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.boolean "default"
    t.boolean "private_default", default: false
    t.index ["user_id"], name: "index_songbooks_on_user_id"
  end

  create_table "songs", force: :cascade do |t|
    t.text "artist"
    t.text "title"
    t.bigint "songbook_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "brand", default: "", null: false
    t.index ["artist"], name: "songs_artist_trgm_idx", opclass: :gin_trgm_ops, using: :gin
    t.index ["songbook_id"], name: "index_songs_on_songbook_id"
    t.index ["title"], name: "songs_title_trgm_idx", opclass: :gin_trgm_ops, using: :gin
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "ketten", default: false, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "songbooks", "users"
  add_foreign_key "songs", "songbooks"
end
