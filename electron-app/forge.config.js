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
      var src = path.join(__dirname, '../client/build/');
      var server_path = path.join(__dirname,'../server/')
      var dst = buildPath;
      fs.cpSync(src, dst, {recursive: true});
    },
    postMake: async (config, makeP) => {
      // fs.mkdirSync(path.join(__dirname,'/yt_server/'));
      fs.cpSync(path.join(__dirname,'../server/'),path.join(__dirname,'/out/electron-app-win32-x64/yt_server/'), {recursive: true});
      fs.cpSync(path.join(__dirname,'../server/setup.exe'),path.join(__dirname,'/out/electron-app-win32-x64/setup.exe'), {recursive: true});
    }
  }
};
