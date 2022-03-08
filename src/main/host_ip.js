const fetch = require("node-fetch");
const cheerio = require("cheerio");
const ping = require("ping");

const IP_ADDRESS = '.ipaddress.com';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
};

async function generateIpAndHost(githubUrls) {
    const hostIpMap = new Map();

    for (let i = 0; i < githubUrls.length; i++) {
        const ip = await getFastIpByHost(githubUrls[i]);
        hostIpMap.set(githubUrls[i], ip);
    }

    return hostIpMap;
}

async function getFastIpByHost(host) {
    const ipAddressUrl = resolveUrl(host);

    let retry = 3;
    let ipAddressContent = '';
    try {
        ipAddressContent = await ipAddress(ipAddressUrl);
    } catch (e) {
        if (retry > 1) {
            retry--;
            ipAddressContent = await ipAddress(ipAddressUrl);
        } else {
            console.error(`${host} fetch failed.`);
        }
    }
    const ipList = parseHtmlContent(ipAddressContent);

    if (ipList.length === 0) {
        return '';
    } else if (ipList.length === 1) {
        return ipList[0];
    } else {
        return findFastIp(ipList);
    }

}

async function ipAddress(url) {
    const response = await fetch(url, {headers: headers});
    return await response.text();
}

function resolveUrl(host) {
    const urlBody = host.split('.');

    if (urlBody.length > 2) {
        return 'https://' + urlBody[urlBody.length - 2] + '.' + urlBody[urlBody.length - 1] + IP_ADDRESS + '/' + host;
    }

    return 'https://' + host + IP_ADDRESS;
}

function parseHtmlContent(htmlContent) {
    const $ = cheerio.load(htmlContent);

    const ipList = [];
    $('#dnsinfo > tr').each((i, el) => {
        const tds = el.children;
        if (tds && tds.length === 3) {
            if ($(tds[1]).text() === 'A') {
                ipList.push($(tds[2]).text())
            }
        }
    });

    return ipList;
}

async function findFastIp(ipList) {
    let fastIp = ipList[0];
    let minAvgTime = 3000;

    const config = {timeout: 10, extra: ['-i', '10']};
    for (let i = 0; i < ipList.length; i++) {
        const res = await ping.promise.probe(ipList[i], config);
        if (res.alive && res.avg < minAvgTime) {
            fastIp = ipList[i];
            minAvgTime = res.avg;
        }
    }

    return fastIp;
}

module.exports = {
    generateIpAndHost,
    getFastIpByHost
}
