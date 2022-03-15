const { getEntries, addHostsEntries, removeHostsEntries } = require('electron-hostile');

async function testGet() {
    // returns entries without comments
    return await getEntries();
}

async function testAdd() {
    return addHostsEntries([
        { ip: '1.1.1.1', host: 'site1.local', wrapper: 'TEST' },
        { ip: '1.1.1.1', host: 'www.site1.local', wrapper: 'TEST' },
    ], { name: 'MYAPP'})
}

async function testRemove() {
    // add multiple entries
    return await removeHostsEntries([
        { host: 'site1.local'},
        { host: 'www.site1.local'},
    ], { name: 'MYAPP'})
}

testGet().then(t => console.log(t));
testAdd().then(t => console.log(t));
testRemove().then(t => console.log(t));
