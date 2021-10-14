// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

import "../faceapi/face-api.min"
require("faceapi/face-api.min")
import "../faceapi/webcam.min"
require("faceapi/webcam.min")
//import "../faceapi/opencv"
//require("faceapi/opencv")

Rails.start()
Turbolinks.start()
ActiveStorage.start()