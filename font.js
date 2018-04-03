/*drawtext="fontfile=/path/to/font.ttf: \
text='Stack Overflow': fontcolor=white: fontsize=24: box=1: boxcolor=black@0.5: \
boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2" -codec:a copy*/

let ffmpeg = require('fluent-ffmpeg');
let Promise = require('bluebird')

ffmpeg('./videos/black.mov')
    .addOption('-vf', `drawtext="fontfile=./fonts/SIXTY.TTF: text='Título do imóvel, que pode ser bem grande ou bem pequeno, tratar isso...': fontcolor=white: fontsize=24: box=1: boxcolor=black@0.5: boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2"`)
    .addOption('-strict', 'experimental')
    .on('end', () => {
        console.log('DOne')
    })
    .on('error', (err) => {
        console.log(err)
    })
    .saveToFile('./output_audio.mp4')
