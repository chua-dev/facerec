class FaceimageUploader < CarrierWave::Uploader::Base
  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  storage :file
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.staff.id}"
    #"uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.staff.staff_name}"

    #model.id
    #model.staff.staff_name
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url(*args)
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process scale: [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process resize_to_fit: [50, 50]
  # end

  # Add an allowlist of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_allowlist
    %w(jpg jpeg gif png)
  end

  def content_type_allowlist
    /image\//
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  #def filename
  #  "face1.jpg" if original_filename.present?
  #end

  def filename
    "face#{model.staff.faces.length}.jpg" if original_filename.present?
    #"#{dynamic_name}.#{file.extension}" if original_filename.present?
  end


  protected

  def dynamic_name
    original_file = :"@#{mounted_as}_original_filenames"

    unless model.instance_variable_get(original_file)
      model.instance_variable_set(original_file, {})
    end

    object = model.instance_variable_get(original_file)
    name = "face-label-#{object.length + 1}"
    
    unless model.instance_variable_get(original_file).map{|k,v| k }.include? original_filename.to_sym
      new_value = model.instance_variable_get(original_file).merge({"#{original_filename}": name})
      model.instance_variable_set(original_file, new_value)
    end

    model.instance_variable_get(original_file)[original_filename.to_sym]
  end
end
