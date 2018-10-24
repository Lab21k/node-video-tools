let ffmpeg = require('fluent-ffmpeg');

ffmpeg('./videos/IMG_3472.MOV_text.mp4')
  .input('./snapimov-full.png')
  .addOption('-filter_complex', '[0:v][1:v] overlay=W-w-10:10:enable=\'between(t,0,200)\'')
  .saveToFile('./output_overlay.mp4')
  .on('end', () => {
    console.log('done')
  })
  .on('error', (err) => {
    console.log(err)
  })
