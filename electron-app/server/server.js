const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const cp = require('child_process');
const cors = require('cors')



const app = express();
const port = 5000;

app.get('/', (req,res) => {
    res.send('Nothing to see here folks')
});
app.use(cors())//Fixes error

//For getting video ID
app.get('/get_id', async(req,res) => {
    const url_query = req.query.url
    try{
        const video_id = ytdl.getURLVideoID(url_query);
        res.status(200).json({id: video_id})
    }
    catch(err){
        console.log(err.message)
        res.json({error: err.message})
    }
})

//For getting a lot more data about the video
app.get('/get_data', async (req,res) => {
    const url_query = req.query.url
    const video_options = new Set();
    console.log("--------------------\nVideo URL: "+url_query)
    try{
        const video_id = ytdl.getURLVideoID(url_query);
        console.log("Video ID: "+video_id+"\n--------------------")
        const video_info = await ytdl.getInfo(url_query);
        video_info.formats.forEach(element => {
            if(element.qualityLabel){
                video_options.add({quality: element.qualityLabel, itag: element.itag, fps: element.fps, video_type: element.container})
            }
          })
        res.status(200).json({title: video_info.videoDetails.title,url: req.query.url, id: video_id,length_seconds: video_info.videoDetails.lengthSeconds,desc: video_info.videoDetails.description, video_options: [...video_options]})
    }
    catch(err){
        console.log(err.message)
        res.json({error: err.message})
    }
})

//For downloading a video
app.get('/video/:id/:itag/:name/:format/:audio', async (req,res) => {
    const audio = (req.params.audio === "High") ?  ytdl(req.params.id, { quality: 'highestaudio' }): ytdl(req.params.id, { quality: 'lowestaudio' })
    const video = ytdl(req.params.id, { quality: req.params.itag });
    const ffmpegProcess = cp.spawn(ffmpeg, [
        // Remove ffmpeg's console spamming
        '-loglevel', '8', '-hide_banner',
        // Redirect/Enable progress messages
        '-progress', 'pipe:3',
        // Set inputs
        '-i', 'pipe:4',
        '-i', 'pipe:5',
        // Map audio & video from streams
        '-map', '0:a',
        '-map', '1:v',
        // Keep encoding
        '-c:v', 'copy',
        // Define output file
        `${req.params.name}.${req.params.format}`,
      ], {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
          'inherit', 'inherit', 'inherit',
          /* Custom: pipe:3, pipe:4, pipe:5 */
          'pipe', 'pipe', 'pipe',
        ],
      });
    audio.pipe(ffmpegProcess.stdio[4]);
    video.pipe(ffmpegProcess.stdio[5]);
    ffmpegProcess.on('close', async () => {
        console.log(`Done downloading video ID ${req.params.id}`)
        res.download(path.resolve(`./${req.params.name}.${req.params.format}`), (err) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(`Deleting File ${req.params.id}`)
                fs.unlinkSync(path.resolve( `./${req.params.name}.${req.params.format}`));

            }
        })
    })
});

//For downloading audio
app.get('/audio/:id/:qual/:name/:format', async (req,res) => {
    const audio = (req.params.qual === "High") ?  ytdl(req.params.id, { quality: 'highestaudio' }): ytdl(req.params.id, { quality: 'lowestaudio' })
    const fileName = `${req.params.name}.${req.params.format}`
    const ffmpegProcess = cp.spawn(ffmpeg, [
        // Remove ffmpeg's console spamming
        '-loglevel', '8', '-hide_banner',
        // Redirect/Enable progress messages
        '-progress', 'pipe:3',
        // Set inputs
        '-i', 'pipe:4',
        // Map audio & video from streams
        '-map', '0:a',
        // Keep encoding
        '-c:v', 'copy',
        // Define output file
        `${fileName}`,
      ], {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
          'inherit', 'inherit', 'inherit',
          /* Custom: pipe:3, pipe:4, pipe:5 */
          'pipe', 'pipe', 'pipe',
        ],
      });
    audio.pipe(ffmpegProcess.stdio[4]);
    ffmpegProcess.on('start',() => {
        console.log(`Started downloading audio ID ${req.params.id}`)
    })
    ffmpegProcess.on('close', async () => {
        console.log(`Done downloading audio ID ${req.params.id}`)
        res.download(path.resolve(`./${fileName}`), (err) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(`Deleting File ${fileName}`)
                fs.unlinkSync(path.resolve(`./${fileName}`));

            }
        })
    })
});

//Listening at the port
app.listen(port, () => {
    console.log('Server started on port',port);
})