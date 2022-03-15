const {addHostsEntries, removeHostsEntries} = require('electron-hostile');

const APP_NAME = 'Github Hosts';

function writeHosts(hosts) {
    hosts.forEach(h => h.wrapper = 'github hosts');
    return addHostsEntries(hosts, {name: APP_NAME});
}

function removeHosts(urls) {
    const entries = urls.map(item => ({host: item}));
    return removeHostsEntries(entries, {name: APP_NAME});
}

module.exports = {
    writeHosts,
    removeHosts
}
