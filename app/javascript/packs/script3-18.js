//import '@tensorflow/tfjs-node'
import * as faceapi from 'face-api.js'
//import * as tf from `@tensorflow/tfjs`
console.log('script3-18')

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

var faceMatcher = undefined
var labelWithImage = undefined
var antiSpoof = undefined
var antiSpoof2 = undefined
async function setUp() {
//Load and create FaceMatcher
  labelWithImage = await loadLabeledImages()
  console.log(labelWithImage)
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


  antiSpoof = await tf.loadLayersModel('/models/anti_spoof.json')
  console.log('Successfully Load Anti Spoof Model')
  antiSpoof2 = await tf.loadLayersModel('/models/keras_facenet.json')
  console.log('Successfully Load Anti Spoof Model 2')
}

async function onPlay() {
  const videoEl = $('#inputVideo').get(0)
  if(videoEl.paused || videoEl.ended) {return}//|| !isFaceDetectionModelLoaded())
    //return setTimeout(() => onPlay())

  const detection = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptor()
  
  if (detection) {
    console.log(detection)
    throw new Error("Detection Found !");
    /*
    let testimg = screenShot(videoEl, 1)
    console.log(testimg)
    let testarr = base64ToArrayBuffer(testimg)
    console.log(testarr)
    const testFake = antiSpoof.predict(testarr)
    console.log(testFake)*/
    let testimg = screenShot(videoEl, 1)
    console.log(testimg)
    const testFake = antiSpoof2.predict(testimg)
    console.log(testFake)

    const canvas = $('#overlay').get(0)
    const dims = faceapi.matchDimensions(canvas, videoEl, true)
    faceapi.resizeResults(detection, dims)
    //faceapi.draw.drawDetections(canvas, faceapi.resizeResults(detection, dims), {label: 'I am box'})
    
    const drawOptions = {
      lineWidth: 1,
      boxColor: "#00db08",
    }
    const box = detection.detection.box

    //const resizedDetection = faceapi.resizeResults(detection, displaySize)
    const result = faceMatcher.findBestMatch(detection.descriptor)
    if (faceRecord.includes(result.label) & result.label !== 'unknown') {
      const drawOptions = {
        lineWidth: 1,
        boxColor: "#00db08",
        label: `${result.label} already verified`
      }
      const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
      drawBox.draw(canvas)
    }else if (result.label === 'unknown') {
      const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
      drawBox.draw(canvas)
    }else {
      const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
      drawBox.draw(canvas)
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
      imgd.src = labelWithImage[result.label]
      console.log(labelWithImage['Chua'])
      console.log(labelWithImage['Safwan'])
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
  run()
})

const vid = document.getElementById('inputVideo')
vid.addEventListener('loadedmetadata', (event) => {
  onPlay();
})

async function loadLabeledImages() {
  const labels = gon.staffs_with_id
  console.log(labels)
  const imageWithLabel = {}
  labels.map(async (label)=>{
    for(let i=1; i<=2; i++) {
        const img = await faceapi.fetchImage(`/uploads/face/face_image/${label.id}/face0.jpg`)
        //console.log(img.src)
        imageWithLabel[label.staff_name] = img.src
    }
    document.body.append(label.staff_name+' Faces Loaded | ')
  })
  return imageWithLabel
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

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}