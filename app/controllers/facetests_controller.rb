class FacetestsController < ApplicationController
  before_action :set_facetest, only: [:show, :edit, :update, :destroy]

  # GET /facetests
  # GET /facetests.json
  def index
    @facetests = Facetest.all
  end

  # GET /facetests/1
  # GET /facetests/1.json
  def show
  end

  # GET /facetests/new
  def new
    @facetest = Facetest.new
  end

  # GET /facetests/1/edit
  def edit
  end

  # POST /facetests
  # POST /facetests.json
  def create
    @facetest = Facetest.new(facetest_params)

    respond_to do |format|
      if @facetest.save
        format.html { redirect_to @facetest, notice: 'Facetest was successfully created.' }
        format.json { render :show, status: :created, location: @facetest }
      else
        format.html { render :new }
        format.json { render json: @facetest.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /facetests/1
  # PATCH/PUT /facetests/1.json
  def update
    respond_to do |format|
      if @facetest.update(facetest_params)
        format.html { redirect_to @facetest, notice: 'Facetest was successfully updated.' }
        format.json { render :show, status: :ok, location: @facetest }
      else
        format.html { render :edit }
        format.json { render json: @facetest.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /facetests/1
  # DELETE /facetests/1.json
  def destroy
    @facetest.destroy
    respond_to do |format|
      format.html { redirect_to facetests_url, notice: 'Facetest was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_facetest
      @facetest = Facetest.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def facetest_params
      params.require(:facetest).permit({face_url: []})
      #params.require(:facetest).permit(:face_url)
    end
end
