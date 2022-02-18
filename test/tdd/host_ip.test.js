const {generateIpAndHost} = require("../../src/main/host_ip");

const githubUrls = require('../../static/github-urls.json').urls;

generateIpAndHost(githubUrls).then((result) => console.log(result));
