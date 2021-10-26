//import '@tensorflow/tfjs-node'
import * as faceapi from 'face-api.js'
//import * as tf from `@tensorflow/tfjs`
//run()

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  //faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(setUp)

let faceRecord = []
setInterval(function(){ 
  faceRecord = [];
}, 25000);
const text = document.getElementById("realname")
const exp = document.getElementById("exp")
const age = document.getElementById("age")

///////////// CHECK AVAILABLE DEVICE

let videoSourcesSelect = document.getElementById("video-source");
//let audioSourcesSelect = document.getElementById("audio-source");

// Create Helper to ask for permission and list devices
let MediaStreamHelper = {
    // Property of the object to store the current stream
    _stream: null,
    // This method will return the promise to list the real devices
    getDevices: function() {
        return navigator.mediaDevices.enumerateDevices();
    },
    // Request user permissions to access the camera and video
    requestStream: async function() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
      const videoEl = $('#inputVideo').get(0)
      videoEl.srcObject = stream
      if (this._stream) {
          this._stream.getTracks().forEach(track => {
              track.stop();
          });
      }

      //const audioSource = audioSourcesSelect.value;
      const videoSource = videoSourcesSelect.value;
      const constraints = {
          //audio: {
          //    deviceId: audioSource ? {exact: audioSource} : undefined
          //},
          video: {
              deviceId: videoSource ? {exact: videoSource} : undefined
          }
      };
  
      return navigator.mediaDevices.getUserMedia(constraints);
    }
};

MediaStreamHelper.requestStream().then(function(stream){
  console.log(stream);
  // Store Current Stream
  MediaStreamHelper._stream = stream;

  // Select the Current Streams in the list of devices
  //audioSourcesSelect.selectedIndex = [...audioSourcesSelect.options].findIndex(option => option.text === stream.getAudioTracks()[0].label);
  videoSourcesSelect.selectedIndex = [...videoSourcesSelect.options].findIndex(option => option.text === stream.getVideoTracks()[0].label);

  // Play the current stream in the Video element
  //videoPlayer.srcObject = stream;
  
  // You can now list the devices using the Helper
  MediaStreamHelper.getDevices().then((devices) => {
      // Iterate over all the list of devices (InputDeviceInfo and MediaDeviceInfo)
      devices.forEach((device) => {
          let option = new Option();
          option.value = device.deviceId;

          // According to the type of media device
          switch(device.kind){
              // Append device to list of Cameras
              case "videoinput":
                  option.text = device.label || `Camera ${videoSourcesSelect.length + 1}`;
                  videoSourcesSelect.appendChild(option);
                  break;
              // Append device to list of Microphone
              //case "audioinput":
              //    option.text = device.label || `Microphone ${videoSourcesSelect.length + 1}`;
              //    audioSourcesSelect.appendChild(option);
              //    break;
          }

          console.log(device);
      });
  }).catch(function (e) {
      console.log(e.name + ": " + e.message);
  });
}).catch(function(err){
  console.error(err);
}); 


let theVid = document.getElementById('inputVideo')

videoSourcesSelect.onchange = function(){
  MediaStreamHelper.requestStream().then(function(stream){
      MediaStreamHelper._stream = stream;
      theVid.srcObject = stream;
  });
};

//audioSourcesSelect.onchange = function(){
//  MediaStreamHelper.requestStream().then(function(stream){
//      MediaStreamHelper._stream = stream;
//      theVid.srcObject = stream;
//  });
//};

///////////// END AVAILABLE DEVICE

var faceMatcher = undefined
var labelWithImage = undefined
async function setUp() {
//Load and create FaceMatcher
  //labelWithImage = await loadLabeledImages()
  const labeledDescriptors = await loadLabel()
  console.log(labeledDescriptors)
  try {
    faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.52)
    console.log('Done Building FaceMatcher')
    console.log(faceMatcher)
  } catch (err) {
  document.getElementById('error').innerHTML = "No face registered, expected at least one face registered"
  console.log('Building FaceMatcher Error')
  }
}

async function onPlay() {
  const videoEl = $('#inputVideo').get(0)
  let theVid = document.getElementById('inputVideo')
  theVid.msHorizontalMirror = true
  if(videoEl.paused || videoEl.ended) //|| !isFaceDetectionModelLoaded())
    return setTimeout(() => onPlay())

  const detection = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions({inputSize: 224})).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptor()
  
  if (detection) {
    const canvas = $('#overlay').get(0)
    const dims = faceapi.matchDimensions(canvas, videoEl, true)
    faceapi.resizeResults(detection, dims)
    //faceapi.draw.drawDetections(canvas, faceapi.resizeResults(detection, dims), {label: 'I am box'})

    const box = detection.detection.box
    //const drawBox = new faceapi.draw.DrawBox(box, { label: 'I am the box' })
    const drawBox = new faceapi.draw.DrawBox(box, { label: 'I am the box' })
    drawBox.draw(canvas)

    //const resizedDetection = faceapi.resizeResults(detection, displaySize)
    const result = faceMatcher.findBestMatch(detection.descriptor)
    if (faceRecord.includes(result.label) & result.label !== 'unknown') {
      console.log(`${result.label}Already Register`)
    }else if (result.label === 'unknown') {
      console.log("Unknown")
    }else {
      faceRecord.push(result.label)
      //Displaying 3 box result
      let nameCapital = result.label.toUpperCase();
      let expression = detection.expressions
      let currentExp = Object.keys(expression).reduce((a, b) => expression[a] > expression[b] ? a : b);
      let gender = detection.gender
      
      text.innerHTML = `Welcome ${nameCapital}, ${nameCapital} has logged In!`
      exp.innerHTML = `${nameCapital}'s emotion is currently ${currentExp}`
      age.innerHTML = `${nameCapital} today look like ${Math.round(detection.age)} years old ${gender}!`

      let imgc = screenShot(videoEl, 1)
      const imgr = document.getElementById("real")
      const imgd = document.getElementById("detect")
      imgr.src = imgc.src
      //imgd.src = labelWithImage[0][result.label]
      //console.log(labelWithImage[0][result.label])
      const expImg = document.getElementById("exp-pic")
      const ageImg = document.getElementById("age-pic")
      switch(currentExp){
        case "happy":
          expImg.src = '/store/happy5.png';
          responsiveVoice.speak(`Whats Up ${result.label}, Welcome, you look ${currentExp} today!`);
          break;
        case "sad":
          expImg.src = '/store/sad5.png';
          responsiveVoice.speak(`Welcome ${result.label}, you look ${currentExp} today, cheer up`);
          break;
        case "neutral":
          expImg.src = '/store/normal5.PNG';
          responsiveVoice.speak(`Welcome ${result.label}, life is better when you're laughing, have a smile`);
          break;
        case "surprised":
          expImg.src = '/store/surprise5.png';
          responsiveVoice.speak(`Wow ${result.label} has logged, what make u surprise?`);
          break;
      }
      switch(gender){
        case "male":
          ageImg.src = '/store/male3.png';
          break;
        case "female":
          ageImg.src = '/store/female3.png';
          break;
      }
    }
  }
  setTimeout(() => onPlay())
}

async function run() {
  // try to access users webcam and stream the images
  // to the video element
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
  const videoEl = $('#inputVideo').get(0)
  videoEl.srcObject = stream
}

$(document).ready(function() {
  //renderNavBar('#navbar', 'webcam_face_detection')
  //initFaceDetectionControls()
})

const vid = document.getElementById('inputVideo')
vid.addEventListener('loadedmetadata', (event) => {
  onPlay();
})

function loadLabeledImages() {
  const labels = gon.staffs_with_id
  console.log(labels)
  return Promise.all(
      labels.map(async (label)=>{
          const imageWithLabel = {}
          for(let i=1; i<=2; i++) {
              const img = await faceapi.fetchImage(`/uploads/face/face_image/${label.id}/face0.jpg`)
              console.log(img.src)
              imageWithLabel[label.staff_name] = img.src
          }
          document.body.append(label.staff_name+' Faces Loaded | ')
          return imageWithLabel
      })
  )
}

function loadLabel() {
  const label_record = gon.label_record
  
  const count = gon.staffs_with_id
  return Promise.all(
    count.map(async (c, index) => {
      console.log(label_record)
      var value = label_record[Object.keys(label_record)[index]]
      var new_value = []
      value.forEach(v => {
        var newV = new Float32Array(v)
        new_value.push(newV)
      })
      console.log(new_value)
      var name = Object.keys(label_record)[index]
      return new faceapi.LabeledFaceDescriptors(`${name}`, new_value)
    })
  )
}

function screenShot(videoEl, scale) {
  scale = scale || 1

  const canvas = document.createElement("canvas");
  canvas.width = videoEl.clientWidth * scale;
  canvas.height = videoEl.clientHeight * scale;
  canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);

  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}