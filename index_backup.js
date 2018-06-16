let ffmpeg = require('fluent-ffmpeg');
let Promise = require('bluebird')

module.exports = (filePaths, outPath, audioPath, text, fontPath) => {
    let rand = Math.random().toString(36).substring(7)
    let temp = `/tmp/temp_video_${rand}`
    let tempName = `${temp}.mp4`
    console.log('wat is this I dont even')

    return new Promise((resolve, reject) => {
        console.log('Executing ffmpeg')

        return ffmpeg(__dirname + '/black.mp4')
            .addOption('-strict', 'experimental')
            .complexFilter({
                filter: 'drawtext',
                options: {
                    fontfile: fontPath,
                    text: text,
                    fontsize: 54,
                    fontcolor: 'white',
                    x: '(w-text_w)/2',
                    y: '(h-text_h)/2'
                }
            })
            .on('end', () => {
                console.log('ok')
                return Promise.all(
                    filePaths.map((file) => {
                        return new Promise((resolve, reject) => {
                            ffmpeg(file)
                                .renice(5)
                                .addOption('-s', 'hd720')
                                .addOption('-c:v', 'libx264')
                                .addOption('-crf', '23')
                                .addOption('-c:a', 'aac')
                                .addOption('-strict', '-2')
                                .saveToFile(file)

                            ffmpeg.on('end', () => {
                                console.log('Scaled video to 720p')
                                resolve()
                            })

                            ffmpeg.on('error', (err, err2, err3) => {
                                console.log('Error', err.message)
                                console.log('err2', err2)
                                console.log('err3', err3)
                                reject(err)
                                process.exit(1)
                            })
                        })
                    })
                ).then(() => {
                    console.log('Scaling ended.')
                    process.exit(1)
                }).catch(() => {
                    console.log('Catched error..')
                    process.exit(1)
                })

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

                proc.mergeToFile(tempName).saveToFile(`${temp}_black.mp4`)
            })
            .on('error', (err) => {
                console.log('erroed.')
                console.log(err)
            })
    })
}
