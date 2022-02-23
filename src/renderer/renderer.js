const {ipcRenderer} = require('electron');

const $code = document.getElementById('code');
const $generate = document.getElementById('generate');
const $progress = document.getElementById('progress');

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

ipcRenderer.on('msg.generate.start', (event, msg) => {
    console.log(event, msg);
    progress.max = msg.total;
});

ipcRenderer.on('msg.generate.result', (event, msg) => {
    console.log(event, msg);
    $code.innerHTML += `<div><span class="ip">${msg.ip}</span><span>${msg.host}</span></div>`;
    progress.value += 1;
});

ipcRenderer.on('msg.generate.end', (event) => {
    console.log(event);
});

function reset() {
    progress.max = 0;
    progress.value = 0;
    $code.innerHTML = '';
}
