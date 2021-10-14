//import * as Webcam from 'webcamjs';
import Webcam from 'webcamjs'
import Typewriter from 'typewriter-effect/dist/core';
import * as faceapi from 'face-api.js'

console.log('Start Loading Models')
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  //faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(console.log('Finish Loading Models'))

/*
let word = document.getElementById('typing');

let typewriter = new Typewriter(word, {
    loop: false,
    delay: 25,
    deleteSpeed: 1,
})


function starting() {
    typewriter.typeString('Welcome to Face Registration...')
        .deleteAll()
        .start();
    let img = document.getElementById('guide')
    //img.src = '/store/smile1.JPG'
    
    typewriter.typeString('Press Snapshot to get started')
    .start();
}

starting()*/
/*
Webcam.set({
    width: 330,
    height: 250,
    dest_width: 640, 
    dest_height: 480,
    crop_width: 240,
    crop_height: 240,
    image_format: 'jpg',
    jpeg_quality: 35,
})*/

Webcam.set({
    // live preview size
    width: 320,
    height: 240,
    
    // device capture size
    dest_width: 320,
    dest_height: 240,
    
    // final cropped size
    crop_width: 240,
    crop_height: 240,
    
    // format and quality
    image_format: 'jpeg',
    jpeg_quality: 95
});

window.onbeforeunload = resetCam;
function resetCam() {
    Webcam.reset()
}

function attachCam() {
    Webcam.attach("#camera")
}
attachCam();

const counting = []

let count = 0
/*
function take_snapshot() {
    Webcam.snap(function(data_uri){
        if(count >= 5){
            count = 0
        }
        document.getElementById(`i${count}`).innerHTML = 
        '<img src="'+data_uri+'" />';
        //single value
        let face_iterate = document.getElementById(`face${count}`)
        face_iterate.value = data_uri
        count = count + 1
    })
}*/

function take_snapshot() {
    Webcam.snap(function(data_uri){
        let guide = document.getElementById('guide')
        let word = document.getElementById('typing')

        let face_form = document.getElementById('face_form')
        let descriptor_form = document.getElementById('face_loc')

        let cap1 = document.getElementById('cap1')
        let cap2 = document.getElementById('cap2')
        let cap3 = document.getElementById('cap3')
        let cap4 = document.getElementById('cap4')
        let cap5 = document.getElementById('cap5')

        switch(count) {
            case 0:
                guide.src = '/store/front1.JPG'
                word.innerHTML = 'Start by looking <strong>STRAIGHT</strong>... & snap! AND WAIT FOR AWHILE!'
                break;
            case 1:
                getDescriptor(data_uri)
                    .then((data) => {
                        if (data === null) {
                            console.log('data is null')
                            word.innerHTML = 'We are unable to detect your face in this photo, press to take again'
                            count = count - 1
                        }
                        else {
                        console.log('data has value')
                        let submitButton = document.getElementById('descriptor-btn')
                        descriptor_form.value = data
                        console.log(descriptor_form.value)
                        face_form.value = data_uri
                        submitButton.click()
                        cap1.src = data_uri
                        word.innerHTML = 'Great..., now to the <strong>LEFT</strong>'
                        guide.src = '/store/left1.JPG'
                        }
                    })
                break;
            case 2:
                getDescriptor(data_uri)
                    .then((data) => {
                        if (data === null) {
                            console.log('data is null')
                            word.innerHTML = 'We are unable to detect your face in this photo, press to take again'
                            count = count - 1
                        }
                        else {
                        console.log('data has value')
                        let submitButton = document.getElementById('descriptor-btn')
                        descriptor_form.value = data
                        console.log(descriptor_form.value)
                        face_form.value = data_uri
                        submitButton.click()
                        cap2.src = data_uri
                        word.innerHTML = "When there's left, there's <strong>RIGHT</strong>"
                        guide.src = '/store/right1.JPG'
                        }
                    })
                break;
            case 3:
                getDescriptor(data_uri)
                    .then((data) => {
                        if (data === null) {
                            console.log('data is null')
                            word.innerHTML = 'We are unable to detect your face in this photo, press to take again'
                            count = count - 1
                        }
                        else {
                        console.log('data has value')
                        let submitButton = document.getElementById('descriptor-btn')
                        descriptor_form.value = data
                        console.log(descriptor_form.value)
                        face_form.value = data_uri
                        submitButton.click()
                        cap3.src = data_uri
                        word.innerHTML = "Almost there.. Look <strong>UP</strong>"
                        guide.src = '/store/smile1.JPG'
                        }
                    })
                break;
            case 4:
                getDescriptor(data_uri)
                    .then((data) => {
                        if (data === null) {
                            console.log('data is null')
                            word.innerHTML = 'We are unable to detect your face in this photo, press to take again'
                            count = count - 1
                        }
                        else {
                        console.log('data has value')
                        let submitButton = document.getElementById('descriptor-btn')
                        descriptor_form.value = data
                        console.log(descriptor_form.value)
                        face_form.value = data_uri
                        submitButton.click()
                        cap4.src = data_uri
                        word.innerHTML = "Look <strong>DOWN</strong>, and finally we are done..."
                        guide.src = '/store/down1.JPG'
                        }
                    })
                break;
            case 5:
                getDescriptor(data_uri)
                    .then((data) => {
                        if (data === null) {
                            console.log('data is null')
                            word.innerHTML = 'We are unable to detect your face in this photo, press to take again'
                            count = count - 1
                        }
                        else {
                        console.log('data has value')
                        let submitButton = document.getElementById('descriptor-btn')
                        descriptor_form.value = data
                        console.log(descriptor_form.value)
                        face_form.value = data_uri
                        submitButton.click()
                        cap5.src = data_uri
                        word.innerHTML = "Ok, your face label created, "
                        guide.src = '/store/front1.JPG'
                        }
                    })
                break;
            default:
                guide.src = '/store/what.JPG'
                word.innerHTML = "You had captured <strong>5 Image</strong>, click reset to capture again..."
                count = 6
                break;
        }
        count = count + 1
    })
}

function take_upload() {
    Webcam.snap( function(data_uri) {
		var raw_image_data = data_uri.replace(/^data\:image\/\w+\;base64\,/, '');
		document.getElementById('mydata').value = raw_image_data;
        console.log(raw_image_data)
		//document.getElementById('myform').submit();
	} );
}

function reset() {
    //let cap = document.getElementById('captured')
    let guide = document.getElementById('guide')
    //let guide_word = document.getElementById('guide-word')
    guide.src = '/store/front1.JPG'
    typewriter.deleteAll()
        .typeString('Welcome to Face Registration..')
        .deleteAll()
        .typeString('Press Snapshot to get started')
        .start();

    count = 0

    let face_form = document.getElementById('face_form')
    face_form.value = ''


    let cap1 = document.getElementById('cap1')
    let cap2 = document.getElementById('cap2')
    let cap3 = document.getElementById('cap3')
    let cap4 = document.getElementById('cap4')
    let cap5 = document.getElementById('cap5')
    cap1.src = ''
    cap2.src = ''
    cap3.src = ''
    cap4.src = ''
    cap5.src = ''
}

async function getDescriptor(based){
    try {
    const image = await faceapi.fetchImage(based);
    let detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
    const descriptor = detection.descriptor;
    return descriptor;
    } catch (error){
        console.log(error)
        return null
    }
}


const capbut = document.getElementById("capture")
capbut.addEventListener("click", take_snapshot);

const resetbut = document.getElementById("reset")
resetbut.addEventListener("click", reset)