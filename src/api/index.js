const ServerList = require('./serverlist');

const conf = require('../conf.json');
const fetch = require('node-fetch');

/**
 * Server as defined by api status/ endpoint
 * @typedef {Object} GameServerData
 * @property {number} clients The total client count on the server
 * @property {number} uptime The server's uptime in seconds
 * @property {boolean} online Indicates if the server is online or not
 * @property {number} mspt The milliseconds per tick, server speed check
 * @property {string} host The host url / address, used for connection
 * @property {string} code Raw server code, containing server provider-region-gamemode
 * @property {string} [hash] The server's hash, used for the server link
 */


class API {
    /**
     * @param {boolean} [allowCache] Determines whether or not you you allow request caching, defaults to `true`
     */
    constructor(allowCache = true) {
        this._allowCache = allowCache;
        this._cache = {}
    }

    /**
     * Attempts to fetch an endpoint, if the first root server isn't available, it'll attempt the next
     * 
     * @param {string} endpoint Endpoint it'll be request, part of the path
     * @returns {Object}
     * 
     */
    async fetch(endpoint) {
        // Retrieve from the cache if its active
        if (this._allowCache) {
            if (this._cache[endpoint] && this._cache[endpoint]) {
                if (Date.now() - this._cache[endpoint]._date < conf.api.cache_timeout) {
                    const res = JSON.parse(JSON.stringify(this._cache[endpoint]))

                    delete res._date;

                    return res;
                }
            }
        }

        for (let root of conf.api.roots) {
            try {
                const res = await fetch(`https://${root}.d.nsrv.cloud:2222/` + endpoint).then(res => res.json());

                if (this._allowCache) {
                    this._cache[endpoint] = JSON.parse(JSON.stringify(res));
                    this._cache[endpoint]._date = Date.now()
                }

                return res;
            } catch {
                continue
            }
        }

        throw new Error('Arras api unavailable')
    }
    /**
     * Fetches all servers and returns a server list object
     * 
     * @returns {Promise<ServerList>}
     */
    fetchServers() {
        return this.fetch('status').then(res => {
            if (!res.ok) throw new Error('Arrasio server error - api NOT ok');

            return new ServerList(Object.entries(res.status).map(([hash, server]) => ({ ...server, hash })));
        });
    }
    /**
     * Fetches the arrasio global client count 
     * 
     * @returns {Promise<number>}
     */
    fetchClientCount() {
        return this.fetch('clientCount').then(res => {
            if (!res.ok) throw new Error('Arrasio server error - api NOT ok');

            return res.clients;
        });
    }

}

module.exports = API;