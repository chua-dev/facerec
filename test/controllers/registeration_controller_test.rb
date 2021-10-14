require "test_helper"

class RegisterationControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get registeration_index_url
    assert_response :success
  end
end
