/**
 * 获取group数据
 */

const http = require('http');
const https = require('https');
const url = require('url');
const config = require('../config');
const configPkg = require('../config/config.json');

/**
 * 获取组数据
 * @return {Promise}
 */
function getGroupsData() {
    return new Promise((resolve, reject) => {
        const match = config.gitlabGroup.match(/^(http|https):\/\/(\S+)\/groups\/(\S+)$/i);

        // [ 'http://git.jtjr.com/groups/noop', 'http', 'git.jtjr.com', 'noop']
        // http://git.jtjr.com/api/v3/groups/noop
        if (!match) {
            return reject('Repository url format error.');
        }

        const urlInfo = url.parse(`${match[1]}://${match[2]}`);
        const request = iO(urlInfo.protocol);

        if (!request) {
            return reject('Protocol error.');
        }

        const options = {
            hostname: urlInfo.host,
            port: getPort(urlInfo),
            path: `/api/v3/groups/${match[3]}?private_token=${configPkg.privateToken}`,
            headers: {
                'User-Agent': config.userAgent
            },
            method: 'GET'
        };

        const req = request(options, (res) => {
            if (res.statusCode === 401) {
                return reject('401 unauthorized. Please configure your private token first.');
            }

            const data = [];
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                data.push(chunk);
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data.join('')));
                } catch (e) {
                    reject('Data Format error.');
                }
            });
        });

        req.on('error', (e) => {
            reject(`Problem with request: ${e.message}`);
        });

        req.end();
    });
}

/**
 * request
 * @param {String} protocol 
 */
function iO(protocol) {
    if (protocol === 'http:') {
        return http.request;
    }

    if (protocol === 'https:') {
        return https.request;
    }

    return null;
}

/**
 * 获取端口
 * @param {Object} urlInfo 
 */
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
