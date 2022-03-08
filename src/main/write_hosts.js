const hostile = require('hostile');

function removeHost(host) {
    const lines = hostile.get(false) || [];
    lines.forEach((item) => {
        if (item[1] === host) {
            hostile.remove(item[0], host);
        }
    });
}

function writeHosts(hosts) {
    try {
        hosts.forEach((host) => {
            removeHost(host.name);
            hostile.set(host.ip, host.name);
        });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const args = process.argv[2];
const hosts = [];
args.split('#').forEach(s => {
    const h = s.split('@');
    hosts.push({ip: h[0], name: h[1]});
})
writeHosts(hosts);
