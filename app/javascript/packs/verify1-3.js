import * as faceapi from 'face-api.js'

const verifyButton = document.getElementById('v-btn')
verifyButton.addEventListener('click', refreshPage)

function refreshPage() {
  window.location.reload();
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
  //faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(testImages)

async function testImages() {
  const textArea = document.getElementById("verify")
  const errTitle = document.getElementById("err-title")
  const eSection = document.getElementById("e-section")
  const noteIcon = document.getElementById("note")
  const recommend = document.getElementById("recommended")
  //const labels = gon.staffs_with_id
  //const nilList = []
  const c_id = gon.current_user_id
  for(let i=1; i<=5; i++) {

      const img = await faceapi.fetchImage(`/uploads/face/face_url/${c_id}/face-label-${i}.jpg`)
      //const img = faceapi.fetchImage(`/uploads/face/face_url/${label.id}/face-label-${i}.jpg`)
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      if (detection === undefined) {
        if (!document.getElementById(`err${i}`)) {
        textArea.innerHTML += '<li id="err'+i+'"> System cannot detect any face in Photo '+i+'</li>';
        errTitle.innerHTML = 'Error Message'
        eSection.classList.add('background-err')
        noteIcon.classList.add('fa', 'fa-info-circle', 'wrong', 'fa-lg')
        //recommend.innerHTML = 'You are highly recommended to delete and reupload a new batches.'
        }
        const icon = document.getElementById(`f${i}`)
        icon.classList.add('fa', 'fa-times-circle', 'icon', 'fa-lg', 'wrong')
        //icon.innerHTML += '<i class="fa fa-times-circle icon fa-lg wrong" aria-hidden="true"></i>'
      } else {
        const icon = document.getElementById(`f${i}`)
        icon.classList.add('fa', 'fa-check-circle', 'icon', 'fa-lg', 'correct')
        //icon.innerHTML += '<i class="fa fa-check-circle icon fa-lg correct" aria-hidden="true"></i>'
      }
    }
}