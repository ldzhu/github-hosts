const {ipcRenderer} = require('electron');

const $code = document.getElementById('code');
const $generate = document.getElementById('generate');
const $progress = document.getElementById('progress');
const $modify = document.getElementById('modify');
const $hotKey = document.getElementById('hot-key');
const $remove = document.getElementById('remove');

// ip host data cache.
let hosts = [];
let generateEnd = false;
// progressbar
const progress = {
    get value() {
        return $progress.value;
    },
    set value(v) {
        $progress.value = v;
    },
    set max(total){
        $progress.max = total;
    }
}

$generate.addEventListener('click', ()=> {
    reset();
    ipcRenderer.send('generate.click', {});
})

$modify.addEventListener('click', () => {
    ipcRenderer.send('modify.click', hosts);
})

$hotKey.addEventListener('click', () => {
    $generate.click();
    const timer = setInterval(() => {
        if (generateEnd) {
            $modify.click();
            clearInterval(timer);
        }
    }, 3000);
})

$remove.addEventListener('click', () => {
    ipcRenderer.send('remove.click');
});

ipcRenderer.on('msg.generate.start', (event, msg) => {
    progress.max = msg.total;
});

ipcRenderer.on('msg.generate.result', (event, msg) => {
    hosts.push(msg);
    $code.innerHTML += `<div><span class="ip">${msg.ip}</span><span>${msg.name}</span></div>`;
    progress.value += 1;
});

ipcRenderer.on('msg.generate.end', () => {
    generateEnd = true;
});

ipcRenderer.on('msg.modify.successful', (event, successful, msg) => {
    if (successful) {
        alert('hosts写入成功');
    } else {
        alert(msg);
    }
});

ipcRenderer.on('msg.remove.successful', (event, successful, msg) => {
    if (successful) {
        reset();
        alert('hosts清除成功');
    } else {
        alert(msg);
    }
});

function reset() {
    progress.max = 0;
    progress.value = 0;
    hosts = [];
    generateEnd = false;
    $code.innerHTML = '';
}
