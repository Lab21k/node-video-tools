let ffmpeg = require('fluent-ffmpeg');
let Promise = require('bluebird')

module.exports = (filePaths, outPath, audioPath, text, fontPath) => {
    let rand = Math.random().toString(36).substring(7)
    let temp = `/tmp/temp_video_${rand}`
    let tempName = `${temp}.mp4`

    return new Promise((resolve, reject) => {
        ffmpeg(__dirname + '/black.mp4')
            .addOption('-strict', 'experimental')
            .complexFilter({
                filter: 'drawtext',
                options: {
                    fontfile: fontPath,
                    text: text,
                    fontsize: 32,
                    fontcolor: 'white',
                    x: '(w-text_w)/2',
                    y: '(h-text_h)/2'
                }
            })
            .on('end', () => {
              //let firstVideo = filePaths.shift()
                let proc = filePaths.reduce((acc, file) => {
                        return acc.input(file)
                    }, ffmpeg(`${temp}_black.mp4`)
                    .renice(5)
                    .addOption('-strict', 'experimental')
                )

                proc.on('end', () => {
                    ffmpeg()
                        .renice(5)
                        .addOption('-strict', 'experimental')
                        .addOption('-shortest')
                        .addInput(audioPath)
                        .addInput(tempName)
                        .on('end', () => {
                            resolve()
                            console.log('Audio filtered.')
                        })
                        .on('error', (err) => {
                            reject(err)
                            console.log('Audio error', err)
                        })
                        .saveToFile(outPath)
                })

                proc.on('error', (err, err2, err3) => {
                    console.log('Error', err.message)
                    console.log('err2', err2)
                    console.log('err3', err3)
                    reject(err)
                })

                proc
                    .mergeToFile(tempName)
            })
            .on('error', (err) => {
                console.log(err)
            })
            .saveToFile(`${temp}_black.mp4`)
    })
}
