require "application_system_test_case"

class FacesTest < ApplicationSystemTestCase
  setup do
    @face = faces(:one)
  end

  test "visiting the index" do
    visit faces_url
    assert_selector "h1", text: "Faces"
  end

  test "creating a Face" do
    visit faces_url
    click_on "New Face"

    fill_in "Face url", with: @face.face_url
    click_on "Create Face"

    assert_text "Face was successfully created"
    click_on "Back"
  end

  test "updating a Face" do
    visit faces_url
    click_on "Edit", match: :first

    fill_in "Face url", with: @face.face_url
    click_on "Update Face"

    assert_text "Face was successfully updated"
    click_on "Back"
  end

  test "destroying a Face" do
    visit faces_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Face was successfully destroyed"
  end
end
