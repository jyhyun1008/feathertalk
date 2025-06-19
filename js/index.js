

document.addEventListener('mousemove',function(e){
    document.querySelector('#bang').setAttribute('style', `top: ${-10 + (e.clientY / document.body.clientHeight) * 20}px`)

    document.querySelector('#mouth').setAttribute('style', `top: ${-15 + (e.clientY / document.body.clientHeight) * 30}px`)

    document.querySelector('#eyes').setAttribute('style', `top: ${-15 + (e.clientY / document.body.clientHeight) * 30}px`)

    document.querySelector('#face').setAttribute('style', `top: ${-5 + (e.clientY / document.body.clientHeight) * 10}px`)

    document.querySelector('#back').setAttribute('style', `top: ${5 - (e.clientY / document.body.clientHeight) * 10}px`)

document.querySelector('#first').setAttribute('style', `transform: rotate(${(e.clientX - document.body.clientWidth/2)/document.body.clientWidth*15}deg);`)

})
    
async function audio () {
  let volumeCallback = null;
  let volumeInterval = 1;
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
        document.querySelector('#mouth').setAttribute('src', 'assets/mouthopen.png')
      } else {
        document.querySelector('#mouth').setAttribute('src', 'assets/mouth.png')
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
        document.querySelector('#mouth').setAttribute('src', 'assets/mouthopen.png')
      } else {
        document.querySelector('#mouth').setAttribute('src', 'assets/mouth.png')
      }
    };
  }
  setInterval(() => {
    
  volumeCallback()
  }, 100);
};
audio()