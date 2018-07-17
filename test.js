let videoTools = require('./index')

videoTools.muteIntro([{name: 'Quarto 1', room: 'bedroom', path: 'videos/output720_3'},{name: 'teste', room: 'intro', path: 'videos/output720'}, {name: 'Banheiro 2', room: 'bathroom', path: 'videos/output720_2'}], 'output.mp4', 'audios/1.mp3', 'Lindo apartamento na barra da tijuca com 5 quartos', '/Users/andre/Dev/21k/Snapimov/API/themes/pacote_7.ttf')
    .then(() => {
        console.log('done')
    }).catch((err) => {
        console.log('wat', err)
    })
