document.querySelector('#submit').addEventListener('click',function(e){
    localStorage.setItem('ftBang', document.querySelector('#bang').value)
    localStorage.setItem('ftEyes', document.querySelector('#eyes').value)
    localStorage.setItem('ftEyesClosed', document.querySelector('#eyesclosed').value)
    localStorage.setItem('ftMouth', document.querySelector('#mouth').value)
    localStorage.setItem('ftMouthOpen', document.querySelector('#mouthopen').value)
    localStorage.setItem('ftFace', document.querySelector('#face').value)
    localStorage.setItem('ftBody', document.querySelector('#body').value)
    localStorage.setItem('ftBack', document.querySelector('#back').value)

    location.href = location.origin + '/live.html'
})
