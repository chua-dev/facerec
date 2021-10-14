require "test_helper"

class FacetestsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @facetest = facetests(:one)
  end

  test "should get index" do
    get facetests_url
    assert_response :success
  end

  test "should get new" do
    get new_facetest_url
    assert_response :success
  end

  test "should create facetest" do
    assert_difference('Facetest.count') do
      post facetests_url, params: { facetest: { face_url: @facetest.face_url } }
    end

    assert_redirected_to facetest_url(Facetest.last)
  end

  test "should show facetest" do
    get facetest_url(@facetest)
    assert_response :success
  end

  test "should get edit" do
    get edit_facetest_url(@facetest)
    assert_response :success
  end

  test "should update facetest" do
    patch facetest_url(@facetest), params: { facetest: { face_url: @facetest.face_url } }
    assert_redirected_to facetest_url(@facetest)
  end

  test "should destroy facetest" do
    assert_difference('Facetest.count', -1) do
      delete facetest_url(@facetest)
    end

    assert_redirected_to facetests_url
  end
end
