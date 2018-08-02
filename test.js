let videoTools = require('./index')

videoTools.muteIntro([{
    name: 'Quarto 1',
    room: 'bedroom',
    path: 'videos/videos_snap/163633679274aa53596f9b1e5d8b32b8'
}, {
    name: 'teste',
    room: 'intro',
    path: 'videos/videos_snap/19b08dbe47bccac421fe3d409f166831'
}, {
    name: 'teste 2',
    room: 'intro',
    path: 'videos/videos_snap/385f98d673ca85b37a70545bda77dd71'
}, {
    name: 'Banheiro 1',
    room: 'bathroom',
    path: 'videos/videos_snap/5036be3b96475b239f9cc732f73b50a6'
}, {
    name: 'Banheiro 2',
    room: 'bathroom',
    path: 'videos/videos_snap/54ecf1b6705c50a089dae2221dcb7c2c'
}, {
    name: 'Banheiro 3',
    room: 'bathroom',
    path: 'videos/videos_snap/6f7dff91cf97acf1665f38648f2f2c86'
}, {
    name: 'Banheiro 4',
    room: 'bathroom',
    path: 'videos/videos_snap/70b72e7a27527c3bcb7db51dc4008c29'
}, {
    name: 'Banheiro 5',
    room: 'bathroom',
    path: 'videos/videos_snap/784940a6fad725ecc3ccbdebced3904b'
}, {
    name: 'Banheiro 6',
    room: 'bathroom',
    path: 'videos/videos_snap/7fa36f47cc3af62d601781629e866b6e'
}, {
    name: 'Banheiro 7',
    room: 'bathroom',
    path: 'videos/videos_snap/c980481d256448f5ae3196bcbc5d9d11'
}, {
    name: 'Banheiro 8',
    room: 'bathroom',
    path: 'videos/videos_snap/e3df47626723201a3c74cc08840f37b7'
}], 'output.mp4', 'audios/pacote_1.mp3', 'Lindo apartamento na barra da tijuca com 5 quartos', '/Users/andre/Dev/21k/Snapimov/API/themes/pacote_7.ttf')
.then(() => {
    console.log('done')
}).catch((err) => {
    console.log('wat', err)
})
