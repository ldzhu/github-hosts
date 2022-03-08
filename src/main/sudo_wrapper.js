const sudo = require("sudo-prompt");
const path = require('path');

function writeHostsWrapper(hosts, mainWindow) {
    if (!hosts || hosts.length === 0) {
        mainWindow.webContents.send('msg.modify.successful', false, '生成hosts后才能修改');
        return;
    }

    const filePath = path.join(__dirname, 'write_hosts.js');
    let args = '';
    hosts.forEach(host => {
        args += `${host.ip}@${host.name}#`
    });
    args = args.substring(0, args.length - 1);

    sudo.exec(`node ${filePath} ${args}`, {name: 'Electron'}, (error) => {
        if (error) {
            console.error(error);
            mainWindow.webContents.send('msg.modify.successful', false, error);
        }
        mainWindow.webContents.send('msg.modify.successful', true);
    })
}

module.exports = {
    writeHostsWrapper
}
