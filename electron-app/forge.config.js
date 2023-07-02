const path = require('path');
const fs = require('fs');


module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  hooks: {
    packageAfterCopy: async (config, buildPath, electronVersion, platform, arch) => {
      var dst = buildPath;
      var src = path.join(__dirname,'../client/build/');
      fs.cpSync(src, dst, {recursive: true});
    },
    postMake: async (config, makeP) => {
      //Copies server files into the out directory
      fs.cpSync(path.join(__dirname,'../server/server.exe'),path.join(__dirname,'/out/electron-app-win32-x64/server.exe'), {recursive: true});//Node server
      fs.cpSync(path.join(__dirname,'../server/userSettings.json'),path.join(__dirname,'/out/electron-app-win32-x64/userSettings.json'), {recursive: true});//JSON file containing user settings
      fs.cpSync(path.join(__dirname,'../server/node_modules/ffmpeg-static/'),path.join(__dirname,'/out/electron-app-win32-x64/ffmpeg/'), {recursive: true});//Executable needed by the node server
      fs.cpSync(path.join(__dirname,'../win_setup.exe'),path.join(__dirname,'/out/electron-app-win32-x64/win_setup.exe'), {recursive: true});
    }
  }
};
