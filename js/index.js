
var ftBang = 'assets/bang.png'
if (localStorage.getItem('ftBang')) {
    ftBang = localStorage.getItem('ftBang')
}
var ftEyes = 'assets/eyes.png'
if (localStorage.getItem('ftEyes')) {
    ftEyes = localStorage.getItem('ftEyes')
}
var ftEyesClosed = 'assets/eyesclosed.png'
if (localStorage.getItem('ftEyesClosed')) {
    ftEyesClosed = localStorage.getItem('ftEyesClosed')
}
var ftMouth = 'assets/mouth.png'
if (localStorage.getItem('ftMouth')) {
    ftMouth = localStorage.getItem('ftMouth')
}
var ftMouthOpen = 'assets/mouthopen.png'
if (localStorage.getItem('ftMouthOpen')) {
    ftMouthOpen = localStorage.getItem('ftMouthOpen')
}
var ftFace = 'assets/face.png'
if (localStorage.getItem('ftFace')) {
    ftFace = localStorage.getItem('ftFace')
}
var ftBody = 'assets/body.png'
if (localStorage.getItem('ftBody')) {
    ftBody = localStorage.getItem('ftBody')
}
var ftBack = 'assets/back.png'
if (localStorage.getItem('ftBack')) {
    ftBack = localStorage.getItem('ftBack')
}

document.querySelector('#bang').setAttribute('src', ftBang)
document.querySelector('#eyes').setAttribute('src', ftEyes)
document.querySelector('#mouth').setAttribute('src', ftMouth)
document.querySelector('#face').setAttribute('src', ftFace)
document.querySelector('#body').setAttribute('src', ftBody)
document.querySelector('#back').setAttribute('src', ftBack)

document.addEventListener('mousemove',function(e){
    document.querySelector('#bang').setAttribute('style', `top: ${-10 + (e.clientY / document.body.clientHeight) * 20}px`)
    document.querySelector('#mouth').setAttribute('style', `top: ${-15 + (e.clientY / document.body.clientHeight) * 30}px`)
    document.querySelector('#eyes').setAttribute('style', `top: ${-15 + (e.clientY / document.body.clientHeight) * 30}px`)
    document.querySelector('#face').setAttribute('style', `top: ${-5 + (e.clientY / document.body.clientHeight) * 10}px`)
    document.querySelector('#back').setAttribute('style', `top: ${5 - (e.clientY / document.body.clientHeight) * 10}px`)
document.querySelector('#character').setAttribute('style', `transform: rotate(${(e.clientX - document.body.clientWidth/2)/document.body.clientWidth*15}deg);`)
})
    
async function audio () {
  let volumeCallback = null;
  // Initialize
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true
      }
    });
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.minDecibels = -127;
    analyser.maxDecibels = 0;
    analyser.smoothingTimeConstant = 0.4;
    audioSource.connect(analyser);
    const volumes = new Uint8Array(analyser.frequencyBinCount);
    volumeCallback = () => {
      analyser.getByteFrequencyData(volumes);
      let volumeSum = 0;
      for(const volume of volumes)
        volumeSum += volume;
      const averageVolume = volumeSum / volumes.length;

      if (averageVolume >= 30 && new Date() % 400 >= 200) {
        document.querySelector('#mouth').setAttribute('src', ftMouthOpen)
      } else {
        document.querySelector('#mouth').setAttribute('src', ftMouth)
      }
      if (new Date() % 3000 >= 2800) {
        document.querySelector('#eyes').setAttribute('src', ftEyesClosed)
      } else {
        document.querySelector('#eyes').setAttribute('src', ftEyes)
      }
      // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
    };
  } catch(e) {
    console.error('Failed to initialize volume visualizer, simulating instead...', e);
    // Simulation
    //TODO remove in production!
    let lastVolume = 50;
    volumeCallback = () => {
      const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
      lastVolume = volume;
      if (lastVolume >= 30 && new Date() % 400 >= 200) {
        document.querySelector('#mouth').setAttribute('src', ftMouthOpen)
      } else {
        document.querySelector('#mouth').setAttribute('src', ftMouth)
      }
      if (new Date() % 3000 >= 2800) {
        document.querySelector('#eyes').setAttribute('src', ftEyesClosed)
      } else {
        document.querySelector('#eyes').setAttribute('src', ftEyes)
      }
    };
  }
  setInterval(() => {
    
  volumeCallback()
  }, 100);
};
audio()