/**
 * util
 */

const os = require('os');

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

module.exports = {
    getIPAddress
};
