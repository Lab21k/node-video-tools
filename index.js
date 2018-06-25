let ffmpeg = require('fluent-ffmpeg');
let Promise = require('bluebird')

module.exports = (videos, outPath, audioPath, text, fontPath) => {
    let rand = Math.random().toString(36).substring(7)
    let temp = `/tmp/temp_video_${rand}`
    let tempName = `${temp}.mp4`
    let filePaths = videos.map(video => {
        return video.path
    })

    return new Promise((resolve, reject) => {
        ffmpeg(__dirname + '/black.mp4')
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
                Promise.all(
                    videos.map((video) => {
                      let file = video.path
                        return new Promise((_resolve, _reject) => {
                            let proc = ffmpeg()
                                .renice(5)
                                .addInput(file)
                                .addOption('-s', 'hd720')
                                .addOption('-c:v', 'libx264')
                                .addOption('-crf', '23')
                                .addOption('-c:a', 'aac')
                                .addOption('-strict', '-2')
                                .addOption('-f', 'mp4')
                                .saveToFile(`${file}_720.mp4`)

                            proc.on('end', () => {
                                console.log('Scaled video to 720p')
                                ffmpeg(file)
                                    .addOption('-strict', 'experimental')
                                    .complexFilter({
                                        filter: 'drawtext',
                                        options: {
                                            text: video.name,
                                            fontsize: 54,
                                            fontcolor: 'white',
                                            x: '50',
                                            y: 'h - 100'
                                        }
                                    })
                                    .saveToFile(`${file}`)
                                    .on('end', () => {
                                        console.log('Added title on video.')
                                        _resolve()
                                    })
                                    .on('error', (err) => {
                                        console.log('ERROED!!')
                                        console.log(err)
                                        _reject()
                                    })
                            })

                            proc.on('error', (err, err2, err3) => {
                                console.log('Error', err.message)
                                console.log('err2', err2)
                                console.log('err3', err3)
                                _reject(err)
                            })
                        })
                    })
                ).then(() => {
                    console.log('Scaling ended.')

                    let proc = filePaths.reduce((acc, file) => {
                            return acc.input(`${file}_720.mp4`)
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
                .catch((err) => {
                    console.log(err)
                    console.log('Catched error..')
                    reject()
                })
            })
            .on('error', (err) => {
                console.log(err)
                reject()
            })
            .saveToFile(`${temp}_black.mp4`)
    })
}
