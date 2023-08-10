/**
 * Joshua Bernstein
 * server.js
 */

//Imported libraries or functions
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const os = require('os');
const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const cors = require('cors');

//Unchanging constants
const curUser = os.userInfo().username;
const app = express();
const default_port = 6547;
const base_download_path = ""
const settings_path = './userSettings.json';
const ffmpeg_path = "ffmpeg/ffmpeg.exe";


//Variable fields
var port = 6547;//Default value for port is 6547
var server_settings = {};

//Sets the server_settings JSON from the file, using the default values otherwise
if(fs.existsSync(settings_path)){
    const fileData = fs.readFileSync(settings_path);
    const settings = JSON.parse(fileData);

    if(Object.keys(settings).length){
        port = Number(settings.General.port);
        server_settings = {
            port: port,
            download_type: settings.Downloads.download_type,
            download_path: settings.Downloads.download_path
        };
    }
}
else{
    server_settings = {
        port: default_port,
        download_type: "prompt",
        download_path: base_download_path,
    };
}
console.log(server_settings);


app.use(cors())//Fixes error, idk what the error was, but this fixes it
app.get('/', (req,res) => {
    res.send('Nothing to see here folks')
});

//Used to test connection to the server
app.get('/test_connection', (req,res) => {
    res.send('Connection successful!');
});


//Checks to see if the file path given by req.query.path exists
app.get('/is_valid_path', (req,res) => {
    if(fs.existsSync(path.resolve(req.query.path))){
        res.send(true);
    }
    else{
        res.send(false);
    }
});

//Used to save config settings from the client
app.get('/apply_settings', (req,res) => {
    const string_data = JSON.stringify(req.query.settings)
    console.log("Trying to apply...");
    fs.writeFileSync(settings_path,string_data);
    server_settings = {
        ...server_settings,
        download_type: req.query.settings.Downloads.download_type,
        download_path: req.query.settings.Downloads.download_path,
    };
    console.log('Changing settings');
    res.send('Settings changed!');
});


//Used for the client to recieve the config settings from the file
app.get('/get_settings', (req,res) => {
    if(fs.existsSync(settings_path)){
        const data = fs.readFileSync(settings_path);
        try {
            const user_settings = JSON.parse(data);
            if(Object.keys(user_settings).length){
                res.send(user_settings);
            }
            else{
                console.log('GetSettings Error');
                res.send({error: true})
            }
        } catch (error) {
            console.log('Error parsing JSON',data);
            res.send({error: true});
        }
    }
    else{
        console.log('Creating file...');
        var new_settings = fs.createWriteStream(settings_path);
        new_settings.write("{}");
        new_settings.end();
        res.send({error: true});
    }
});


//For getting video ID
app.get('/get_id', async(req,res) => {
    const url_query = req.query.url
    try{
        const video_id = ytdl.getURLVideoID(url_query);
        res.status(200).json({id: video_id})
    }
    catch(err){
        res.json({error: err.message})
    }
})

//For getting a lot more data about the video
app.get('/get_data', async (req,res) => {
    const url_query = req.query.url
    const video_options = new Set();
    try{
        const video_id = ytdl.getURLVideoID(url_query);
        const video_info = await ytdl.getInfo(url_query);
        video_info.formats.forEach(element => {
            if(element.qualityLabel){
                video_options.add({quality: element.qualityLabel, itag: element.itag, fps: element.fps, video_type: element.container})
            }
          })
        res.status(200).json({title: video_info.videoDetails.title,url: req.query.url, id: video_id,
            length_seconds: video_info.videoDetails.lengthSeconds,desc: video_info.videoDetails.description, video_options: [...video_options]});
    }
    catch(err){
        res.json({error: err.message})
    }
})

//For downloading a video
app.get('/video/:id/:itag/:name/:format/:audio', async (req,res) => {
    const fileName = (server_settings.download_type === "prompt") ? `${req.params.name}.${req.params.format}` : `${server_settings.download_path}/${req.params.name}.${req.params.format}`
    const audio = (req.params.audio === "High") ?  ytdl(req.params.id, { quality: 'highestaudio' }): ytdl(req.params.id, { quality: 'lowestaudio' })
    const video = ytdl(req.params.id, { quality: req.params.itag });
    const ffmpegProcess = cp.spawn(ffmpeg_path, [
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
    video.pipe(ffmpegProcess.stdio[5]);
    ffmpegProcess.on('start',() => {
        console.log(`Started downloading video file ${fileName}`)
    })
    ffmpegProcess.on('close', async () => {
        // console.log(`Done downloading video ID ${req.params.id}`)
        if(server_settings.download_type === "prompt"){
            res.download(path.resolve(fileName), (err) => {
                if(err){
                    console.log(err)
                }
                else{
                    fs.unlinkSync(path.resolve(fileName));
                }
            });
        }
        else{
            res.status(200).send("All good!");
        }
    })
});


//For downloading audio
app.get('/audio/:id/:qual/:name/:format', async (req,res) => {
    const audio = (req.params.qual === "High") ?  ytdl(req.params.id, { quality: 'highestaudio' }): ytdl(req.params.id, { quality: 'lowestaudio' })
    const fileName = (server_settings.download_type === "prompt") ? `${req.params.name}.${req.params.format}` : `${server_settings.download_path}/${req.params.name}.${req.params.format}`


    const ffmpegProcess = cp.spawn(ffmpeg_path, [
        // Remove ffmpeg's console spamming
        '-loglevel', '8', '-hide_banner',
        // Redirect/Enable progress messages
        '-progress', 'pipe:3',
        // Set inputs
        '-i', 'pipe:4',
        // Map audio & video from streams
        '-map', '0:a',
        // Keep encoding
        '-c:a', 'copy',
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
        console.log(`Started downloading audio file ${fileName}`)
    })
    ffmpegProcess.on('close', async () => {
        // console.log(`Done downloading audio ID ${req.params.id}`)
        if(server_settings.download_type === "prompt"){
            console.log('prompting...');
            res.download(`./${fileName}`, (err) => {
                if(err){
                    console.log(err);
                    res.end();
                }
                else{
                    fs.unlinkSync(path.resolve(fileName));
                }
            });

        }
        else{
            res.status(200).send("All good!");
        }
    })
});



//Finds an available port #
async function findPort(){
    var foundPort = false;
    //Find an open port on the machine, starting at the default value
    while(!foundPort){
        try {
            await app.listen(port, () => {
                console.log('Server started on port',port);
            })
            foundPort = true;
        } catch (error) {
            console.log(error);
            console.log(`Port ${port} did not work, trying another one...`);
            port++;
            break
        }
    }
}

findPort();
console.log("Current Username: "+curUser);