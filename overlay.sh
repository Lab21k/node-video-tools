ffmpeg -i videos/IMG_3472.MOV -i snap.png \
    -filter_complex "[0:v][1:v] overlay=(W-w)/2:(H-h)/2:enable='between(t,0,20)'"  \
    -pix_fmt yuv420p \
    -c:a copy output.mp4

ffmpeg -i input.mp4 -i image.png \
-filter_complex "[0:v][1:v] overlay=25:25:enable='between(t,0,20)'" \
-pix_fmt yuv420p -c:a copy \
output.mp4
