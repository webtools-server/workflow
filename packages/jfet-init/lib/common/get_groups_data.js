/**
 * 获取group数据
 */

const http = require('http');
const https = require('https');
const url = require('url');
const configPkg = require('../config/config.json');

function getGroupsData() {
    return new Promise((resolve, reject) => {
        // https://github.com/fe-template
        // https://api.github.com/orgs/fe-template/repos
        const match = configPkg.repositoryURL.match(/^(http|https):\/\/(\S+)\/(\S+)$/i);

        // ["https://github.com/fe-template/", "https", "github.com", "fe-template"]
        if (!match) {
            reject('Repository url format error. Please reconfigure the repository url.');
        }

        const urlInfo = url.parse(`${match[1]}://api.${match[2]}`);
        const request = iO(urlInfo.protocol);

        if (!request) {
            reject('Protocol error.');
        }

        const options = {
            hostname: urlInfo.host,
            port: getPort(urlInfo),
            path: `/orgs/${match[3]}/repos`,
            headers: {
                'User-Agent': 'Ifet-init'
            },
            method: 'GET'
        };

        const req = request(options, (res) => {
            if (res.statusCode === 401) {
                reject('401 Unauthorized');
            }

            const data = [];
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                data.push(chunk);
            });
            res.on('end', () => {
                resolve(data.join(''));
            });
        });

        req.on('error', (e) => {
            reject(`problem with request: ${e.message}`);
        });

        req.end();
    });
}

function iO(protocol) {
    if (protocol === 'http:') {
        return http.request;
    } else if (protocol === 'https:') {
        return https.request;
    } else {
        return null;
    }
}

function getPort(urlInfo) {
    const protocol = urlInfo.protocol;
    let port = 80;

    if (protocol === 'https:') {
        port = 443;
    }

    if (urlInfo.port) {
        port = urlInfo.port;
    }

    return port;
}

module.exports = getGroupsData;
