let videoTools = require('./index')

videoTools([{name: 'Banheiro 1', room: 'intro', path: 'videos/output720'}, {name: 'Banheiro 2', room: 'bathroom', path: 'videos/output720_2'}], 'output.mp4', 'audios/1.mp3', 'hhaahahah video enorme pra carlaho de grande muito grande mesmo enorme o titulo dessa porra vai ficar mt pequeno eu espero espero mesmo, tenho fé, tenho mt fé')
    .then(() => {
        console.log('done')
    }).catch((err) => {
        console.log('wat')
    })
