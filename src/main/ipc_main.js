const {ipcMain} = require('electron');

const {getFastIpByHost} = require("./utils/host_ip");
const {writeHosts, removeHosts} = require('./utils/hosts');

const githubUrls = require('../../static/github-urls.json').urls;

module.exports = function (mainWindow) {
    ipcMain.on('generate.click', async () => {
        mainWindow.webContents.send('msg.generate.start', {total: githubUrls.length});

        await Promise.all(githubUrls.map(async (host) => {
            const ip = await getFastIpByHost(host);
            mainWindow.webContents.send('msg.generate.result', {ip: ip, host: host});
        }))

        mainWindow.webContents.send('msg.generate.end');
    });

    ipcMain.on('modify.click', (event, hosts) => {
        if (!hosts || hosts.length === 0) {
            mainWindow.webContents.send('msg.modify.successful', false, '生成hosts后才能修改');
            return;
        }

        writeHosts(hosts).then((msg) => {
            mainWindow.webContents.send('msg.modify.successful', true, msg);
        }).catch((error) => {
            console.error(error);
            mainWindow.webContents.send('msg.modify.successful', false, error);
        })
    });

    ipcMain.on('remove.click', () => {
        removeHosts(githubUrls).then(msg => {
            mainWindow.webContents.send('msg.remove.successful', true, msg);
        }).catch(error => {
            console.error(error);
            mainWindow.webContents.send('msg.remove.successful', false, error);
        })
    })

}
