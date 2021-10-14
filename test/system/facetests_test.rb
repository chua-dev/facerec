require "application_system_test_case"

class FacetestsTest < ApplicationSystemTestCase
  setup do
    @facetest = facetests(:one)
  end

  test "visiting the index" do
    visit facetests_url
    assert_selector "h1", text: "Facetests"
  end

  test "creating a Facetest" do
    visit facetests_url
    click_on "New Facetest"

    fill_in "Face url", with: @facetest.face_url
    click_on "Create Facetest"

    assert_text "Facetest was successfully created"
    click_on "Back"
  end

  test "updating a Facetest" do
    visit facetests_url
    click_on "Edit", match: :first

    fill_in "Face url", with: @facetest.face_url
    click_on "Update Facetest"

    assert_text "Facetest was successfully updated"
    click_on "Back"
  end

  test "destroying a Facetest" do
    visit facetests_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Facetest was successfully destroyed"
  end
end
