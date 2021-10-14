require "test_helper"

class IdentificationControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get identification_index_url
    assert_response :success
  end
end
