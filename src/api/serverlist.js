const Server = require('./server')

/**
 * @extends Array
 */
class ServerList extends Array {
    /**
     * @param {GameServerData[]} raw Raw server data - response from status/
     */
    constructor(raw) {
        super(...Array.from(raw).map(d => new Server(d)));
        this._raw = Array.from(raw);
    }
    /**
     * Selects server with the same hash
     * @param {string} hash Hash of selection
     * @returns {Server}
     */
    get(hash) {
        return this.byHash(hash);
    }

    /**
     * Used to retrieve servers by their gamemode
     * @param  {...string} gamemodes Gamemode strings, to be looked for in the `name` of the server
     * @returns {Server[]}
     */
    filterByGamemode(...gamemodes) {
        return this.filter(server => {
            let gms = server.gamemode.split(" ");

            return gamemodes.every(g => gms.includes(g));
        });
    }
    /**
     * Retrieves all servers in a specific region
     * @param {string} region region of selection
     * @returns {Server[]}
     */
    filterByRegion(region) {
        return this.filter(server => server.region === region)
    }

    /**
     * Selects server with the same hash
     * @param {string} hash Hash of selection
     * @returns {Server}
     */
    byHash(hash) {
        return this.find(server => server.hash.slice(1) === hash.slice(hash.indexOf('#') === -1 ? 0 : 1))
    }
}

module.exports = ServerList;