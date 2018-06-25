let videoTools = require('./index')

videoTools([{name: 'Banheiro 1', path: 'videos/output720'}], 'output.mp4', 'audios/1.mp3')
    .then(() => {
        console.log('done')
    }).catch((err) => {
        console.log('wat')
    })
