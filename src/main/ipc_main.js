const {ipcMain} = require('electron');

const {getFastIpByHost} = require("./host_ip");
const githubUrls = require('../../static/github-urls.json').urls;

module.exports = function () {
    ipcMain.on('generate.click', async () => {
        global.mainWindow.webContents.send('msg.generate.start', {total: githubUrls.length});

        await Promise.all(githubUrls.map(async (host) => {
            const ip = await getFastIpByHost(host);
            global.mainWindow.webContents.send('msg.generate.result', {ip: ip, host: host});
        }))

        global.mainWindow.webContents.send('msg.generate.end');
    });

}