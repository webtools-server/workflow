/**
 * util
 */

const os = require('os');

const toStr = Object.prototype.toString;

const getIPAddress = (() => {
    const ifaces = os.networkInterfaces();
    const defultAddress = '127.0.0.1';
    let ip = defultAddress;

    function it(details) {
        if (ip === defultAddress && details.family === 'IPv4') {
            ip = details.address;
        }
    }

    for (const dev in ifaces) {
        ifaces[dev].forEach(it);
    }

    return ip;
})();

function isObject(obj) {
    return toStr.call(obj) === '[object Object]';
}

module.exports = {
    getIPAddress,
    isObject
};
