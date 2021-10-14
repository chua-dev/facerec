//import * as Webcam from 'webcamjs';
import Webcam from 'webcamjs'
import Typewriter from 'typewriter-effect/dist/core';

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

starting()
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
        //let cap = document.getElementById('captured')
        let guide = document.getElementById('guide')
        //let guide_word = document.getElementById('guide-word')
        switch(count) {
            case 0:
                guide.src = '/store/front1.JPG'
                //guide_word.innerHTML = 'Start by Looking Straight..'
                typewriter.deleteAll()
                    .typeString('Start by looking <strong>STRAIGHT</strong>... & snap!')
                    .start();
                break;
            case 1:
                let face1 = document.getElementById('face1')
                let cap1 = document.getElementById('cap1')
                guide.src = '/store/left1.JPG'
                cap1.src = data_uri
                face1.value = data_uri
                console.log(face1.value)
                typewriter.deleteAll()
                    .typeString('Great..., now to the <strong>LEFT</strong>')
                    .start();
                break;
            case 2:
                let face2 = document.getElementById('face2')
                let cap2 = document.getElementById('cap2')
                guide.src = '/store/right1.JPG'
                cap2.src = data_uri
                face2.value = data_uri
                //console.log(face2.value)
                typewriter.deleteAll()
                    .typeString("When there's left, there's <strong>RIGHT</strong>")
                    .start();
                break;
            case 3:
                let face3 = document.getElementById('face3')
                let cap3 = document.getElementById('cap3')
                guide.src = '/store/smile1.JPG'
                cap3.src = data_uri
                face3.value = data_uri
                console.log(face3.value)
                typewriter.deleteAll()
                    .typeString('Almost there.. Look <strong>UP</strong>')
                    .start();
                break;
            case 4:
                let face4 = document.getElementById('face4')
                let cap4 = document.getElementById('cap4')
                guide.src = '/store/down1.JPG'
                cap4.src = data_uri
                face4.value = data_uri
                console.log(face4.value)
                typewriter.deleteAll()
                    .typeString('Look <strong>DOWN</strong>, and finally we are done...')
                    .start();
                break;
            case 5:
                let face5 = document.getElementById('face5')
                let cap5 = document.getElementById('cap5')
                guide.src = '/store/front1.JPG'
                cap5.src = data_uri
                face5.value = data_uri
                typewriter.deleteAll()
                    .typeString("Ok, you're done, click <strong>SUBMIT</strong> to register, click <strong>RESET</strong> to recapture")
                    .start();
                break;
            default:
                guide.src = '/store/what.JPG'
                typewriter.deleteAll()
                    .typeString('You had captured <strong>5 Image</strong>, click reset to capture again...')
                    .start();
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

    let face1 = document.getElementById('face1')
    let face2 = document.getElementById('face2')
    let face3 = document.getElementById('face3')
    let face4 = document.getElementById('face4')
    let face5 = document.getElementById('face5')
    face1.value = ''
    face2.value = ''
    face3.value = ''
    face4.value = ''
    face5.value = ''

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


const capbut = document.getElementById("capture")
capbut.addEventListener("click", take_snapshot);

const resetbut = document.getElementById("reset")
resetbut.addEventListener("click", reset)