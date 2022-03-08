const {ipcMain} = require('electron');

const {getFastIpByHost} = require("./host_ip");
const {writeHostsWrapper, removeHostsWrapper} = require('./sudo_wrapper');
const githubUrls = require('../../static/github-urls.json').urls;

module.exports = function (mainWindow) {
    ipcMain.on('generate.click', async () => {
        mainWindow.webContents.send('msg.generate.start', {total: githubUrls.length});

        await Promise.all(githubUrls.map(async (host) => {
            const ip = await getFastIpByHost(host);
            mainWindow.webContents.send('msg.generate.result', {ip: ip, name: host});
        }))

        mainWindow.webContents.send('msg.generate.end');
    });

    ipcMain.on('modify.click', (event, hosts) => {
        writeHostsWrapper(hosts, mainWindow);
    });

    ipcMain.on('remove.click', () => {
        removeHostsWrapper(githubUrls, mainWindow);
    })

}
