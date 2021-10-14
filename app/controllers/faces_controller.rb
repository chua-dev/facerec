class FacesController < ApplicationController
  before_action :set_face, only: [:show, :edit, :update, :destroy]

  # GET /faces
  # GET /faces.json
  def index
    @faces = Face.all
    #@current_user_id = current_user.id
    @current_user_id = 3 # HARD CODED
    gon.current_user_id = @current_user_id
  end

  # GET /faces/1
  # GET /faces/1.json
  def show
  end

  # GET /faces/new
  def new
    @face = Face.new
    @descriptor = Descriptor.new
  end

  # GET /faces/1/edit
  def edit
  end

  # POST /faces
  # POST /faces.json
  def create
    raw = face_params[:face_descriptor]
    f_descriptor = raw.split(",").map { |each| each.to_f }
    @face = Face.new(face_descriptor: f_descriptor, staff_id: face_params[:staff_id], face_image: face_params[:face_image])
    @face.save
    byebug
  end

  # PATCH/PUT /faces/1
  # PATCH/PUT /faces/1.json
  def update
    respond_to do |format|
      if @face.update(face_params)
        format.html { redirect_to @face, notice: 'Face was successfully updated.' }
        format.json { render :show, status: :ok, location: @face }
      else
        format.html { render :edit }
        format.json { render json: @face.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /faces/1
  # DELETE /faces/1.json
  def destroy
    @face.destroy
    respond_to do |format|
      format.html { redirect_to faces_url, notice: 'Face was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

=begin
  def descriptor
    @descriptors = Descriptor.all
  end

  def new_descriptor
    raw = descriptor_params[:face_location]
    face_loc = raw.split(",").map { |each| each.to_f }
    @descriptor = Descriptor.new(face_location: face_loc, staff_id: descriptor_params[:staff_id])
    @descriptor.save
=begin
    respond_to do |format|
      if @descriptor.save
        format.html { redirect_to @descriptor, notice: 'Face was successfully created.' }
        format.json { render :show, status: :created, location: @descriptor }
      else
        format.html { render :new }
        format.json { render json: @descriptor.errors, status: :unprocessable_entity }
      end
    end

  end

  def delete_descriptor
    @descriptor = Descriptor.find(params[:id])
    @descriptor.destroy

    respond_to do |format|
      format.html { redirect_to descriptor_path, notice: 'Descriptor was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
=end
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_face
      @face = Face.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def face_params
      params.require(:face).permit(:staff_id, :face_image, :face_descriptor)
      #params.require(:face).permit({face_url: []}, :staff_id)
    end
end
