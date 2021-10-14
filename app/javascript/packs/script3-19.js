//import '@tensorflow/tfjs-node'
//import * as tf from `@tensorflow/tfjs`
import * as faceapi from 'face-api.js'
console.log('scripte3-17 test')
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
}, 10000);
const text = document.getElementById("realname")
const exp = document.getElementById("exp")
const age = document.getElementById("age")

var antiSpoof1 = undefined
var antiSpoof2 = undefined
var faceMatcher = undefined
var labelWithImage = undefined
async function setUp() {
//Load and create FaceMatcher
  antiSpoof1 = await tf.loadLayersModel('/spoofm/model.json')
  antiSpoof2 = await tf.loadLayersModel('/spoofm2/model2.json')
  console.log(antiSpoof2)

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
}

async function onPlay() {
  const videoEl = $('#inputVideo').get(0)
  if(videoEl.paused || videoEl.ended){return} //|| !isFaceDetectionModelLoaded())
    //return setTimeout(() => onPlay())

  const detection = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptor()
  //console.log(detection)
  if (detection) {
    let imgc = screenShot(videoEl, 1)
    //throw new Error("DETECTION FOUND");
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

      //let imgc = screenShot(videoEl, 1)
      // Get face and put into anti spoof model
      try {
        let canvasSS = document.getElementById('bigss')
        let ctxSS = canvasSS.getContext("2d");
        var imageSS = new Image();
        imageSS.onload = function() {
          ctxSS.drawImage(imageSS, 0, 0);
        };
        imageSS.src = imgc.src

        let imgData = ctxSS.getImageData(0, 0, canvasSS.width, canvasSS.height)
        let srcCv = cv.matFromImageData(imgData)
        console.log(srcCv) //MAT7
        
        let detArray = []
        detArray.push(detection.detection.box.x)
        detArray.push(detection.detection.box.y)
        detArray.push(detection.detection.box.width)
        detArray.push(detection.detection.box.height)
        console.log(detArray)
        let newBox = getNewBox(700,600, detArray, 2.7)
        console.log(newBox) // [0, 5, 699, 599]

        let dst = new cv.Mat()
        let dsize = new cv.Size(80, 80)
        let rect = new cv.Rect(newBox[0],newBox[1],newBox[2] - newBox[0],newBox[3] - newBox[1])
        cv.cvtColor(srcCv, dst, cv.COLOR_RGBA2RGB)
        
        let dstCrop = new cv.Mat()
        dstCrop = dst.roi(rect)
        console.log(dstCrop)
        
        let dstFinal = new cv.Mat()
        cv.resize(dstCrop, dstFinal, dsize)
        console.log(dstFinal)

        //antiSpoof first model predict
        let feedData = (tf.transpose(tf.reshape(tf.tensor(dstFinal.data), [80,80,3]), [2,0,1]))
        //const feedData = (tf.transpose(tf.reshape(tf.tensor(dstFinal.data), [80,80,3])))
        //console.log(feed.dataSync())
        let firstSpoofResult = antiSpoof1.predict(tf.reshape(feedData,[1,3,80,80])).dataSync();
        console.log(softmaxFunction(firstSpoofResult))
        let resultArrayAcc = softmaxFunction(firstSpoofResult)
        let index = indexOfMax(resultArrayAcc)
        console.log(index)

        let htmlResultSentence = document.getElementById('spoofResult')
        if (index === 1) {
          let resultSentence = `This face is ${(resultArrayAcc[index] * 100).toFixed(2)}% Real`
          htmlResultSentence.innerHTML = resultSentence
        } else if (index === 2) {
          let resultSentence = `This face is ${(resultArrayAcc[index] * 100).toFixed(2)}% Fake Mobile Attack`
          htmlResultSentence.innerHTML = resultSentence
        } else if (index === 3) {
          let resultSentence = `This face is ${(resultArrayAcc[index] * 100).toFixed(2)}% Fake Print Attack`
          htmlResultSentence.innerHTML = resultSentence
        }
        
        //Assign capture image beside label image
        const imgr = document.getElementById("real")
        const imgd = document.getElementById("detect")
        imgr.src = imgc.src
        imgd.src = labelWithImage[result.label]

        //Test
        //const testSpoofImage = cv.imread("real")
        //console.log(testSpoofImage)

        console.log(labelWithImage['Chua'])
        console.log(labelWithImage['Safwan'])
        const expImg = document.getElementById("exp-pic")
        const ageImg = document.getElementById("age-pic")
        switch(currentExp){
          case "happy":
            expImg.src = '/store/happy5.png';
            //responsiveVoice.speak(`Whats Up ${result.label}, Welcome, you look ${currentExp} today!`);
            break;
          case "sad":
            expImg.src = '/store/sad5.png';
            //responsiveVoice.speak(`Welcome ${result.label}, you look ${currentExp} today, cheer up`);
            break;
          case "neutral":
            expImg.src = '/store/normal5.PNG';
            //responsiveVoice.speak(`Welcome ${result.label}, life is better when you're laughing, have a smile`);
            break;
          case "surprised":
            expImg.src = '/store/surprise5.png';
            //responsiveVoice.speak(`Wow ${result.label} has logged, what make u surprise?`);
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
      } catch(error) {
        console.log(error)
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

function getNewBox(src_w,src_h,bbox,scale){
  let x = bbox[0], y = bbox[1], box_w = bbox[2], box_h = bbox[3];
  let new_scale = Math.min((src_h-1)/box_h,Math.min((src_w-1)/box_w,scale));
  let new_width = box_w*new_scale, new_height = box_h*new_scale;
  let center_x = box_w/2+x, center_y = box_h/2+y;
  let left_top_x = center_x-new_width/2, left_top_y = center_y-new_height/2;
  let right_bottom_x = center_x+new_width/2, right_bottom_y = center_y+new_height/2;
 
  if(left_top_x < 0){
    right_bottom_x -= left_top_x;
    left_top_x = 0;
  }

  if(left_top_y < 0){
    right_bottom_y -= left_top_y;
    left_top_y = 0;
  }
 
  if(right_bottom_x > src_w-1){
    left_top_x -= right_bottom_x-src_w+1;
    right_bottom_x = src_w-1;
    if(left_top_x < 0){
      left_top_x = 0;
    }
  }
 
  if(right_bottom_y > src_h-1){
    left_top_y -= right_bottom_y-src_h+1;
    right_bottom_y = src_h-1;
    if(left_top_y < 0){
      left_top_y = 0;
    }
  }
  //console.log([left_top_x,left_top_y,right_bottom_x,right_bottom_y])
  return [Math.round(left_top_x),Math.round(left_top_y),Math.round(right_bottom_x),Math.round(right_bottom_y)]
}

function softmaxFunction(resultArray){
  let print = Math.exp(resultArray[0])/(Math.exp(resultArray[0])+Math.exp(resultArray[1])+Math.exp(resultArray[2])), 
  real = Math.exp(resultArray[1])/(Math.exp(resultArray[0])+Math.exp(resultArray[1])+Math.exp(resultArray[2])),
  mobile = Math.exp(resultArray[2])/(Math.exp(resultArray[0])+Math.exp(resultArray[1])+Math.exp(resultArray[2]));
  return [print,real,mobile]
}

function indexOfMax(arr) {
  if (arr.length === 0) {
      return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }

  return maxIndex;
}

/*
function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}*/