let videoTools = require('./index')

videoTools(['videos/IMG_3472.MOV'], 'output.mp4', 'audios/1.mp3')
    .then(() => {
        console.log('done')
    }).catch((err) => {
        console.log('wat')
    })
