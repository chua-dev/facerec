const resVideo = document.querySelector('#registerVid');

window.navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        resVideo.srcObject = stream;
        resVideo.onloadedmetadata = (e) => {
            resVideo.play();
        };
    })
    .catch( () => {
        alert('You have give browser the permission to run Webcam and mic ;( ');
    });

function captureimg() {
    let canvas = document.getElementById("canvas1");
    canvas.getContext('2d').drawImage(resVideo, 0, 0)
}

const capture = document.querySelector("#capture");

capture.addEventListener("click", captureimg())

console.log('js test test1')
/*
function screenShot(videoEl, scale) {
    scale = scale || 1
    
    const canvas = document.createElement("canvas1");
    canvas.width = videoEl.clientWidth * scale;
    canvas.height = videoEl.clientHeight * scale;
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    
    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
}

document.getElementById("capture").addEventListener("click", screen) */