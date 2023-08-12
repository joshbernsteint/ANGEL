
const cp = require('child_process')
// const ffmpeg = require('ffmpeg-static')
/**
 * Converts the file denoted by `FileName` into the `new_extension` format
 * @param {string} converter_path: Path to the converter executable
 * @param {string} cur_extension Current extension of the file
 * @param {string} new_extension Extension to be converted into
 * @param {string} fileName Name of the file to be converted
 * @param {string} newFileName: Name of the converted file
 * @param {Function} callback Function to be called on function completion
 */
async function convert(converter_path, cur_extension, new_extension, fileName, newFileName, callback){
    var ffmpeg_args = ["-i",fileName];
    // ffmpeg_args.push("-c:v","libvpx-vp9", "-crf", "18", "-b:v", "0", "-b:a", "128k", "-c:a", "libopus", newFileName); //mp4 -> webm
    // ffmpeg_args.push("-b:a","192K","-vn",newFileName);//mp4 -> mp3
    var curAudio = false;
    var newAudio = false;
    if(cur_extension === "mp3" || cur_extension === "wav" || cur_extension === "ogg"){
        curAudio = true;
    }
    if(new_extension === "mp3" || new_extension === "wav" || new_extension === "ogg"){
        newAudio = true;
    }



    if(curAudio && !newAudio){//If converting from audio only format -> video format (why would you do this)
        ffmpeg_args.push("-c:a","copy",newFileName);
    }
    else if(curAudio && newAudio){//If converting from audio format -> audio format
        ffmpeg_args.push("-c:a","copy",newFileName);
    }
    else if(!curAudio && newAudio){//If converting from video format -> audio format
        ffmpeg_args.push("-b:a", "192K", "-vn", newFileName);
    }
    else{//If converting from video format -> video format
        ffmpeg_args.push("-c:v","copy","-c:a","copy", newFileName)
    }
    console.log(ffmpeg_args);
    const converter_process = cp.spawn(converter_path, ffmpeg_args, { windowsHide: true });
    converter_process.on("start", () => {
        console.log("Starting conversion...");
    })
    converter_process.on("close", async () => {
        callback();
    })
}

module.exports = convert