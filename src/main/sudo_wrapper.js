const sudo = require("sudo-prompt");
const path = require('path');

const filePath = path.join(__dirname, 'write_hosts.js');

function writeHostsWrapper(hosts, mainWindow) {
    if (!hosts || hosts.length === 0) {
        mainWindow.webContents.send('msg.modify.successful', false, '生成hosts后才能修改');
        return;
    }

    let args = '';
    hosts.forEach(host => {
        args += `${host.ip}@${host.name}#`
    });
    args = args.substring(0, args.length - 1);

    sudo.exec(`node ${filePath} --type=modify --args=${args}`, {name: 'Electron'}, (error) => {
        if (error) {
            console.error(error);
            mainWindow.webContents.send('msg.modify.successful', false, error);
        }
        mainWindow.webContents.send('msg.modify.successful', true);
    })
}

function removeHostsWrapper(urls, mainWindow) {
    let args = urls.join('#');

    sudo.exec(`node ${filePath} --type=remove --args=${args}`, {name: 'Electron'}, (error) => {
        if (error) {
            console.error(error);
            mainWindow.webContents.send('msg.remove.successful', false, error);
        }
        mainWindow.webContents.send('msg.remove.successful', true);
    })
}

module.exports = {
    writeHostsWrapper,
    removeHostsWrapper
}
