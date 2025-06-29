var thres = 30
if (localStorage.getItem('ftThres')) {
  thres = parseInt(localStorage.getItem('ftThres'))
  document.querySelector('#threshold').value=thres
}

var rig = 100
if (localStorage.getItem('ftRig')) {
  rig = localStorage.getItem('ftRig')
  document.querySelector('#rig').value=rig
}

var interval = 1500
var length = parseInt(interval/20)
var intervals = Array.from({ length }, (_, k) => 0 + k * 20);
if (localStorage.getItem('ftInterval')) {
  interval = localStorage.getItem('ftInterval')
  length = parseInt(interval/20)
  intervals = Array.from({ length }, (_, k) => 0 + k * 20);
  document.querySelector('#interval').value=interval
}

var randomX = document.body.clientWidth/2; 
var randomY= document.body.clientHeight/2;

document.querySelector('#threshold').addEventListener('change', function(e){
  thres = e.target.value
  localStorage.setItem('ftThres', thres)
})

document.querySelector('#rig').addEventListener('change', function(e){
  rig = e.target.value
  localStorage.setItem('ftRig', rig)
})

document.querySelector('#interval').addEventListener('change', function(e){
  interval = e.target.value
  localStorage.setItem('ftInterval', interval)

  location.href=location.href;
})

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

document.querySelector('#bangl').setAttribute('src', ftBang)
document.querySelector('#eyesl').setAttribute('src', ftEyes)
document.querySelector('#mouthl').setAttribute('src', ftMouth)
document.querySelector('#facel').setAttribute('src', ftFace)
document.querySelector('#bangr').setAttribute('src', ftBang)
document.querySelector('#eyesr').setAttribute('src', ftEyes)
document.querySelector('#mouthr').setAttribute('src', ftMouth)
document.querySelector('#facer').setAttribute('src', ftFace)
document.querySelector('#body').setAttribute('src', ftBody)
document.querySelector('#back').setAttribute('src', ftBack)

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

      if (averageVolume >= thres && new Date() % 400 >= 200) {
        document.querySelector('#mouthl').setAttribute('src', ftMouthOpen)
        document.querySelector('#mouthr').setAttribute('src', ftMouthOpen)
      } else {
        document.querySelector('#mouthl').setAttribute('src', ftMouth)
        document.querySelector('#mouthr').setAttribute('src', ftMouth)
      }
      if (new Date() % 3000 >= 2800) {
        document.querySelector('#eyesl').setAttribute('src', ftEyesClosed)
        document.querySelector('#eyesr').setAttribute('src', ftEyesClosed)
      } else {
        document.querySelector('#eyesl').setAttribute('src', ftEyes)
        document.querySelector('#eyesr').setAttribute('src', ftEyes)
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
      if (lastVolume >= thres && new Date() % 400 >= 200) {
        document.querySelector('#mouthl').setAttribute('src', ftMouthOpen)
        document.querySelector('#mouthr').setAttribute('src', ftMouthOpen)
      } else {
        document.querySelector('#mouthl').setAttribute('src', ftMouth)
        document.querySelector('#mouthr').setAttribute('src', ftMouth)
      }
      if (new Date() % 3000 >= 2800) {
        document.querySelector('#eyesl').setAttribute('src', ftEyesClosed)
        document.querySelector('#eyesr').setAttribute('src', ftEyesClosed)
      } else {
        document.querySelector('#eyesl').setAttribute('src', ftEyes)
        document.querySelector('#eyesr').setAttribute('src', ftEyes)
      }
    };
  }
  setInterval(() => {
    
  volumeCallback()
  }, 100);
}

  let autoRig = setInterval(async () => {
    var lastRandomX = randomX
    var lastRandomY = randomY
    randomX = Math.random() * document.body.clientWidth / 3 + document.body.clientWidth / 3
    randomY = Math.random() * document.body.clientHeight
    function wait(sec) {
        let start = Date.now(), now = start;
        while (now - start < sec) {
            now = Date.now();
        }
    }
    for await (let i of intervals) {

      setTimeout(() => {
        
      var X = lastRandomX + (randomX - lastRandomX) * i / interval
      var Y = lastRandomY + (randomY - lastRandomY) * i / interval
      
      document.querySelector('#back').setAttribute('style', `top: ${(5 - (Y / document.body.clientHeight) * 10)*rig/100}px`)

      document.querySelector('#bangdivl').setAttribute('style', `width: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#bangdivr').setAttribute('style', `width: min(${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#bangl').setAttribute('style', `width: min(${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh); top: ${(-10 + (Y / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#bangr').setAttribute('style', `width: min(${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (Y / document.body.clientHeight) * 20)*rig/100}px;`)
      
      document.querySelector('#eyesdivl').setAttribute('style', `width: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#eyesdivr').setAttribute('style', `width: min(${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#eyesl').setAttribute('style', `width: min(${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-15 + (Y / document.body.clientHeight) * 30)*rig/100}px;`)

      document.querySelector('#eyesr').setAttribute('style', `width: min(${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-15 + (Y / document.body.clientHeight) * 30)*rig/100}px;`)

      document.querySelector('#mouthdivl').setAttribute('style', `width: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#mouthdivr').setAttribute('style', `width: min(${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#mouthl').setAttribute('style', `width: min(${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (Y / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#mouthr').setAttribute('style', `width: min(${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (Y / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#facedivl').setAttribute('style', `width: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#facedivr').setAttribute('style', `width: min(${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#facel').setAttribute('style', `width: min(${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}vw, ${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}dvh);top: ${(-5 + (Y / document.body.clientHeight) * 10)*rig/100}px;`)

      document.querySelector('#facer').setAttribute('style', `width: min(${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}vw, ${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}dvh);top: ${(-5 + (Y / document.body.clientHeight) * 10)*rig/100}px;`)

      document.querySelector('#character').setAttribute('style', `transform: rotate(${(X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}deg);`)
      }, i*12/20);
    }
  }, interval);
  
audio()

document.addEventListener('mousemove',function(e){
    clearInterval(autoRig)

    document.querySelector('#back').setAttribute('style', `top: ${(5 - (e.clientY / document.body.clientHeight) * 10)*rig/100}px`)

      document.querySelector('#bangdivl').setAttribute('style', `width: min(${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#bangdivr').setAttribute('style', `width: min(${50 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#bangl').setAttribute('style', `width: min(${100 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh); top: ${(-10 + (e.clientY / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#bangr').setAttribute('style', `width: min(${100 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (e.clientY / document.body.clientHeight) * 20)*rig/100}px;`)
      
      document.querySelector('#eyesdivl').setAttribute('style', `width: min(${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#eyesdivr').setAttribute('style', `width: min(${50 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#eyesl').setAttribute('style', `width: min(${100 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-15 + (e.clientY / document.body.clientHeight) * 30)*rig/100}px;`)

      document.querySelector('#eyesr').setAttribute('style', `width: min(${100 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-15 + (e.clientY / document.body.clientHeight) * 30)*rig/100}px;`)

      document.querySelector('#mouthdivl').setAttribute('style', `width: min(${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#mouthdivr').setAttribute('style', `width: min(${50 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#mouthl').setAttribute('style', `width: min(${100 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (e.clientY / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#mouthr').setAttribute('style', `width: min(${100 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (e.clientY / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#facedivl').setAttribute('style', `width: min(${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#facedivr').setAttribute('style', `width: min(${50 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#facel').setAttribute('style', `width: min(${100 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}vw, ${100 + (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}dvh);top: ${(-5 + (e.clientY / document.body.clientHeight) * 10)*rig/100}px;`)

      document.querySelector('#facer').setAttribute('style', `width: min(${100 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}vw, ${100 - (e.clientX - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}dvh);top: ${(-5 + (e.clientY / document.body.clientHeight) * 10)*rig/100}px;`)

    document.querySelector('#character').setAttribute('style', `transform: rotate(${(e.clientX - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}deg);`)

    randomX = 0
    randomY = 0

    autoRig = setInterval(async () => {

    var lastRandomX = randomX?randomX:e.clientX
    var lastRandomY = randomY?randomY:e.clientY
    randomX = Math.random() * document.body.clientWidth
    randomY = Math.random() * document.body.clientHeight
    function wait(sec) {
        let start = Date.now(), now = start;
        while (now - start < sec) {
            now = Date.now();
        }
    }
    for await (let i of intervals) {

      setTimeout(() => {
        
      var X = lastRandomX + (randomX - lastRandomX) * i / interval
      var Y = lastRandomY + (randomY - lastRandomY) * i / interval
      
      document.querySelector('#back').setAttribute('style', `top: ${(5 - (Y / document.body.clientHeight) * 10)*rig/100}px`)

      document.querySelector('#bangdivl').setAttribute('style', `width: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#bangdivr').setAttribute('style', `width: min(${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#bangl').setAttribute('style', `width: min(${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh); top: ${(-10 + (Y / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#bangr').setAttribute('style', `width: min(${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (Y / document.body.clientHeight) * 20)*rig/100}px;`)
      
      document.querySelector('#eyesdivl').setAttribute('style', `width: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#eyesdivr').setAttribute('style', `width: min(${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#eyesl').setAttribute('style', `width: min(${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-15 + (Y / document.body.clientHeight) * 30)*rig/100}px;`)

      document.querySelector('#eyesr').setAttribute('style', `width: min(${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-15 + (Y / document.body.clientHeight) * 30)*rig/100}px;`)

      document.querySelector('#mouthdivl').setAttribute('style', `width: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#mouthdivr').setAttribute('style', `width: min(${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#mouthl').setAttribute('style', `width: min(${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (Y / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#mouthr').setAttribute('style', `width: min(${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}vw, ${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*20*rig/100}dvh);top: ${(-10 + (Y / document.body.clientHeight) * 20)*rig/100}px;`)

      document.querySelector('#facedivl').setAttribute('style', `width: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#facedivr').setAttribute('style', `width: min(${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 - (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh); left: min(${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}vw, ${50 + (X - document.body.clientWidth/2)/document.body.clientWidth*7.5*rig/50}dvh);`)

      document.querySelector('#facel').setAttribute('style', `width: min(${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}vw, ${100 + (X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}dvh);top: ${(-5 + (Y / document.body.clientHeight) * 10)*rig/100}px;`)

      document.querySelector('#facer').setAttribute('style', `width: min(${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}vw, ${100 - (X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}dvh);top: ${(-5 + (Y / document.body.clientHeight) * 10)*rig/100}px;`)

      document.querySelector('#character').setAttribute('style', `transform: rotate(${(X - document.body.clientWidth/2)/document.body.clientWidth*15*rig/100}deg);`)
      }, i*12/20);
    }
  }, interval);
})
    