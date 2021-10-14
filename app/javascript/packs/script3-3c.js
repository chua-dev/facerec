import * as faceapi from 'face-api.js'

const video = document.querySelector('#video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  window.navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = (e) => {
                video.play();
            };
        })
  /*navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )*/
  recognizeFaces()
}

async function recognizeFaces() {
  //const labeledDescriptors = await loadLabeledImages()
  //console.log(labeledDescriptors)
  //const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)

  video.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    const sec = document.getElementById('vid')
    sec.appendChild(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    const canvas2 = faceapi.createCanvasFromMedia(video)
    canvas2.setAttribute('id', 'cv2')
    sec.appendChild(canvas2)
    faceapi.matchDimensions(canvas2, displaySize)

    const ctx = canvas.getContext("2d")
    const ctx2 = canvas2.getContext("2d")

    function draw() {
      //ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      ctx.beginPath();
      ctx.strokeStyle = '#6CFF41';
      ctx.lineWidth = 3;
      ctx.moveTo(175, 130);
      ctx.lineTo(280, 130);
      //ctx.rect(160, 80, 490, 393);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(176, 130);
      ctx.lineTo(176, 230);
      ctx.stroke();
      //scan()
      ctx.beginPath();
      ctx.moveTo(175, 500);
      ctx.lineTo(278, 500);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(178, 500);
      ctx.lineTo(178, 400);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(178, 500);
      ctx.lineTo(178, 400);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(610, 130);
      ctx.lineTo(510, 130);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(610, 127);
      ctx.lineTo(610, 230);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(610, 500);
      ctx.lineTo(510, 500);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(610, 403);
      ctx.lineTo(610, 500);
      ctx.stroke();

      
      ctx2.beginPath();
      //ctx2.globalAlpha = 0.3;
      ctx2.fillStyle = "#DDFFDD"
      ctx2.fillRect(178, 133, 429, 365);
      ctx2.stroke();
  
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    /*const img = await faceapi.fetchImage(`img/chua/1.jpeg`)
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
    const chua = detections.descriptor
    const label_des = [new faceapi.LabeledFaceDescriptors(
      'chua',
      [chua]
    )]
    const faceMatcher = new faceapi.FaceMatcher(label_des, 0.4)*/

    const labeledDescriptors = await loadLabeledImages()
    //console.log(labeledDescriptors)

    //const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4)
    try {
      var faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4)
    } catch (err) {
    document.getElementById('error').innerHTML = "No face registered, expected at least one face registered"
    }
      
    setInterval(async () => {
        const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptor()
        //console.log(detections)
        if(detections){
          face = true
          det = detections
        } else {
          face = false
        }

        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        //faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        //canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        const result = faceMatcher.findBestMatch(resizedDetections.descriptor)
        if (result) {
          resultObj = result
        }

        const box = resizedDetections.detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
        drawBox.draw(canvas)
        /*const results = resizedDetections.map((d) => {
            return faceMatcher.findBestMatch(d.descriptor)
        })
        results.forEach( (result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
        })*/
    }, 100)
  })
}

console.log(gon.staffs)
console.log(gon.staffs_with_id)
console.log(gon.names)

function loadLabeledImages() {
  //const labels = ['Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel']
  //const labels = ['Chua']
  const labels = gon.names // ['chua', 'hafiz', 'hasim']
  //const labels = gon.staffs_with_id
  return Promise.all(
      labels.map(async (label)=>{
          const descriptions = []
          // const image = [123jpg, 123jpg, 213jpg]
          for(let i=1; i<=5; i++) {
              const img = await faceapi.fetchImage(`/uploads/face/face_url/${label}/face-label-${i}.jpg`)
              //const img = await faceapi.fetchImage(`img/${label}/${i}.jpeg`)
              const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
              //console.log(label + i + JSON.stringify(detections))
              descriptions.push(detections.descriptor)
          }
          document.body.append(label+' Faces Loaded | ')
          return new faceapi.LabeledFaceDescriptors(label, descriptions)
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

function print(result, face, detect){
  if (face == true && result) {
    let imgc = screenShot(video, 1)
    const imgr = document.getElementById("real")
    imgr.src = imgc.src

    const text = document.getElementById("realname")
    const exp = document.getElementById("exp")
    const age = document.getElementById("age")

    let expression = detect.expressions
    let currentExp = Object.keys(expression).reduce((a, b) => expression[a] > expression[b] ? a : b);
    let gender = detect.gender
    const expImg = document.getElementById("exp-pic")
    const ageImg = document.getElementById("age-pic")
    let nameCapital = result.label.toUpperCase();

    if (result.label === 'unknown') {
      text.innerHTML = `There is an unknown intruder !`;
      exp.innerHTML = `There is an unknown intruder !`;
      age.innerHTML = `There is an unknown intruder !`;
      imgr.src = '/store/d92.PNG'
      expImg.src = imgc.src;
      ageImg.src = '/store/d92.PNG';
    } else {
      switch(currentExp){
        case "happy":
          //expImg.src = '/store/happy.png';
          expImg.src = '/store/happy5.png';
          break;
        case "sad":
          //expImg.src = '/store/sad.png';
          expImg.src = '/store/sad5.png';
          break;
        case "neutral":
          //expImg.src = '/store/normal2.png';
          expImg.src = '/store/normal5.PNG';
          break;
        case "surprised":
          //expImg.src = '/store/surprise.png';
          expImg.src = '/store/surprise5.png';
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

      text.innerHTML = `Welcome ${nameCapital}, ${nameCapital} has logged In!`
      exp.innerHTML = `${nameCapital}'s emotion is currently ${currentExp}`
      age.innerHTML = `${nameCapital} today look like ${Math.round(detect.age)} years old ${detect.gender}!`
    }
  }
}

let det = '';
let resultObj = '';
let face = false
var intervalId = window.setInterval(function(){
  print(resultObj, face, det)
}, 3990);
