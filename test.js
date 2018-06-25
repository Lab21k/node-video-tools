let videoTools = require('./index')

videoTools([{name: 'Banheiro 1', path: 'videos/IMG_3472.MOV'}], 'output.mp4', 'audios/1.mp3')
    .then(() => {
        console.log('done')
    }).catch((err) => {
        console.log('wat')
    })
