let ffmpeg = require('fluent-ffmpeg');
let Promise = require('bluebird')

const createBlackVideo = (fontSize, text, fontPath, temp) => {
  console.log('Creating black video..')
  return new Promise((resolve, reject) => {
    ffmpeg(__dirname + '/black.mp4')
      .addOption('-strict', 'experimental')
      .complexFilter({
          filter: 'drawtext',
          options: {
              fontfile: fontPath,
              text: text,
              fontsize: fontSize,
              fontcolor: 'white',
              x: '(w-text_w)/2',
              y: '(h-text_h)/2'
          }
      })
      .on('end', () => {
        resolve()
      })
      .on('error', (err) => {
        console.log(err)
        reject()
      })
      .saveToFile(`${temp}_black.mp4`)
  })
}

const titleVideos = (videos, font) => {
  console.log('Adding title to videos...')

  return Promise.map(videos, (video) => {
    let file = video.path

    return new Promise((resolve, reject) => {
      ffmpeg()
        .renice(5)
        .addInput(`${file}_720.mp4`)
        .addOption('-s', 'hd720')
        .addOption('-c:v', 'libx264')
        .addOption('-strict', '-2')
        .addOption('-crf', '23')
        .addOption('-f', 'mp4')
        .videoFilter([`drawtext=text='${video.name}': fontfile=${font}: fontcolor=white: fontsize=58: box=1: boxcolor=black@0.5: boxborderw=5: x=50: y=h-100: borderw=2:bordercolor=black:box=0`])
        .saveToFile(`${file}_720_text.mp4`)
        .on('end', () => {
            console.log('Added title on video.')
            resolve()
        })
        .on('error', (err) => {
            console.log('ERROED!!')
            console.log(err)
            reject()
        })
    })
  }, {concurrency: 1})
}

const normalizeVideos = (videos) => {
  console.log('Normalizing videos..')

  return Promise.map(videos, (video) => {
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
          _resolve()
        })

        proc.on('error', (err, err2, err3) => {
            console.log('Error', err.message)
            console.log('err2', err2)
            console.log('err3', err3)
            _reject(err)
        })
    })
  }, { concurrency: 1 })
}

const addAudio = (videoPath, audioPath, outPath) => {
  console.log('Adding audio to ', videoPath)
  return new Promise((resolve, reject) => {
    ffmpeg()
        .renice(5)
        .addOption('-strict', 'experimental')
        .addOption('-shortest')
        .addInput(audioPath)
        .addInput(videoPath)
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
}

const mergeVideos = (videos, temp, tempName) => {
  console.log('Merging videos..', videos)
  return new Promise((resolve, reject) => {
    let proc = videos.reduce((acc, file) => {
          return acc.input(file)
        }, ffmpeg()
        .renice(5)
      .addOption('-strict', 'experimental')
    )

    proc.on('end', () => resolve())

    proc.on('error', (err, err2, err3) => {
        console.log('Error', err.message)
        console.log('err2', err2)
        console.log('err3', err3)
        reject(err)
    })

    proc.mergeToFile(tempName)
  })
}

function audioIntro(videos, outPath, audioPath, text, fontPath) {
  let fontSize = Math.ceil((1280 / text.length))
  let rand = Math.random().toString(36).substring(7)
  let temp = `/tmp/temp_video_${rand}`
  let tempName = `${temp}.mp4`

  return normalizeVideos(videos)
    .then(() => titleVideos(videos))
    .then(() => {
      let allButIntro = videos.filter((video) => {
        return video.room.indexOf('intro') < 0
      }).map(video => {
        return `${video.path}_720_text.mp4`
      })

      return mergeVideos(allButIntro, temp, `${temp}_video.mp4`)
    })
    .then(() => addAudio(`${temp}_video.mp4`, audioPath, `${temp}_video_audio.mp4`))
    .then(() => createBlackVideo(fontSize, text, fontPath, temp))
    .then(() => {
      console.log('Glue intro videos and black video')
      let introVideos = videos.filter((video) => {
        return video.room.indexOf('intro') > -1
      }).map((video) => `${video.path}_720.mp4`)

      introVideos.unshift(`${temp}_black.mp4`)

      return mergeVideos(introVideos, temp, `${temp}_intro.mp4`)
    })
    .then(() => {
      console.log('Finally glueing everything together')
      let finalVideo = [`${temp}_intro.mp4`, `${temp}_video_audio.mp4`]
      return mergeVideos(finalVideo, temp, outPath)
    })
}

function muteIntro(videos, outPath, audioPath, text, fontPath) {
  let fontSize = Math.ceil((1280 / text.length))
  let rand = Math.random().toString(36).substring(7)
  let temp = `/tmp/temp_video_${rand}`
  let tempName = `${temp}.mp4`

  return normalizeVideos(videos)
    .then(() => titleVideos(videos, fontPath))
    .then(() => {
      let allButIntro = videos.filter((video) => {
        return video.room.indexOf('intro') < 0
      }).map(video => {
        return `${video.path}_720_text.mp4`
      })

      return mergeVideos(allButIntro, temp, `${temp}_video.mp4`)
    })
    .then(() => createBlackVideo(fontSize, text, fontPath, temp))
    .then(() => {
      console.log('Finally glueing everything together')

      let introVideos = videos.filter((video) => {
        return video.room.indexOf('intro') > -1
      }).map((video) => `${video.path}_720.mp4`)

      let finalVideo = [`${temp}_black.mp4`]
        .concat(introVideos)

      finalVideo.push(`${temp}_video.mp4`)

      return mergeVideos(finalVideo, temp, `${temp}_glued_video.mp4`)
    })
    .then(() => addAudio(`${temp}_glued_video.mp4`, audioPath, outPath))
}

module.exports = {
  muteIntro,
  audioIntro
}
