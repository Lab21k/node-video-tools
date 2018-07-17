/*drawtext="fontfile=/path/to/font.ttf: \
text='Stack Overflow': fontcolor=white: fontsize=24: box=1: boxcolor=black@0.5: \
boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2" -codec:a copy*/

let ffmpeg = require('fluent-ffmpeg');
let Promise = require('bluebird')

ffmpeg('./black.mp4')
//.addOption('-vf', `drawtext="fontfile=./fonts/SIXTY.TTF: text='Título do imóvel, que pode ser bem grande ou bem pequeno, tratar isso...': fontcolor=white: fontsize=24: box=1: boxcolor=black@0.5: boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2"`)
  .addOption('-strict', 'experimental')
  .complexFilter({
    filter: 'drawtext',
    options: {
      'fontfile': 'SIXTY.TTF',
      'text': 'Lindo apartamento na Barra da Tijuca',
      fontsize: 24,
      fontcolor: 'white',
      borderw: 3,
      bordercolor: 'black',
      box: 0,
      x: '(w-text_w)/2',
      y: '(h-text_h)/2'
    }
  })
  .on('end', () => {
      console.log('Done')
  })
  .on('error', (err) => {
      console.log(err)
  })
  .saveToFile('./output_audio.mp4')
