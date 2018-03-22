let ffmpeg = require('fluent-ffmpeg');
let Promise = require('bluebird')

module.exports = (filePaths, outPath, audioPath) => {
    let rand = Math.random().toString(36).substring(7)
    let tempName = `/tmp/temp_video_${rand}.mp4`

    return new Promise((resolve, reject) => {
        let firstVideo = filePaths.shift()
        let proc = filePaths.reduce((acc, file) => {
            return acc.input(file)
        }, ffmpeg(firstVideo)
            .renice(5)
            .addOption('-strict', 'experimental')
        )

        proc.on('end', () => {
            ffmpeg()
                .renice(5)
                .addOption('-strict', 'experimental')
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

        proc.on('error', (err) => {
            console.log('Error', err.message)
            reject(err)
        })

        proc
            .mergeToFile(tempName)
    })
}
