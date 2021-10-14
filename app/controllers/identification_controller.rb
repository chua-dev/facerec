class IdentificationController < ApplicationController
  def index
    @staffs = Staff.all

    #Javascript
    #gon.staffs = @staffs

    @names = []
    @staffs.each do |staff|
      if staff.faces.present?
        @names << staff.staff_name
      end
    end

    #labelDescriptor = []

    label_record = Hash.new

    @staffs.each do |staff|
      if staff.faces.present?
        name = staff.staff_name
        descriptor = [] #put all desc in an array
        staff.faces.last(5).each do |face|
          descriptor << face.face_descriptor
        end
        label_record[name] = descriptor #create 'Chua':[[des1], [des2]] etc..
      end
    end

    gon.label_record = label_record

    #gon.labelDescriptor = labelDescriptor
    @staffs_with_id = @staffs.select { |staff| staff.faces.present? }

    gon.staffs_with_id = @staffs_with_id

    gon.names = @names
  end
end
