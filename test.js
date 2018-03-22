let videoTools = require('./index')

videoTools(['videos/1.mov', 'videos/2.mov', 'videos/3.mov'], 'output.mp4', 'audios/1.mp3')
  .then(() => {
    console.log('done')
  })
