'use strict';


var video = document.querySelector('video');
var progress = document.getElementById('progress');
var statusElm = document.getElementById('status');

var startButton = document.getElementById('start');
var captureButton = document.getElementById('capture');
var videoStarted = false;

startButton.onclick = function() {
    if (videoStarted && video.srcObject) {
        video.srcObject.getTracks()[0].stop();
        video.srcObject = null;
        startButton.innerText = 'Start video';
        videoStarted = false;
    } else {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                optional: [
                {minWidth: 320},
                {minWidth: 640},
                {minWidth: 1024},
                {minWidth: 1280},
            ]
        }
        }).then(handleSuccess).catch(handleError);
    }
};

captureButton.onclick = function() {

    Tesseract.recognize(video, {
            lang: document.getElementById('langsel').value
        })
        .progress(handleProgress)
        .catch(err => console.error(err))
        .then(handleRecognize)
        .finally(resultOrError => console.log(resultOrError));
};

function handleProgress(message) {
    console.debug(message);
    statusElm.innerText = message.status;

    if (message.progress) {
        progress.value = message.progress * 100;
        progress.innerText = (message.progress*100 || 0).toFixed(2)
    }
}

function handleRecognize(result) {
    console.info(result);
    document.getElementById('rectext').innerHTML = result.html;

    let info = document.getElementById('recinfo');
    let wordsInfo = '<h4>Words</h4>';
    result.words
        .filter(x => x.confidence > 50 && x.text.length > 2)
        .forEach(word => {
            wordsInfo += `<strong>${word.text}</strong><br/>`;
        });
    info.innerHTML = wordsInfo;
}

function handleSuccess(stream) {
  video.srcObject = stream;
  startButton.innerText = 'Stop video';
  videoStarted = true;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
  videoStarted = false;
}

