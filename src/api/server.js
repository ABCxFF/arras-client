const gamemodeTable = [
    [{
        id: "x",
        u: "Private"
    }],
    [{
        id: "e",
        Hb: "word"
    }],
    [{
        id: "w",
        Hb: "words"
    }],
    [{
        id: "p",
        u: "Portal"
    }],
    [{
        id: "o",
        u: "Open"
    }],
    [{
        id: "m",
        u: "Maze",
        delay: !0,
        remove: "f"
    }],
    [{
        id: "f",
        u: "FFA"
    },
    {
        id: "d",
        u: "Duos"
    },
    {
        id: "s",
        u: "Squads"
    },
    {
        id: "1",
        u: "1 Team",
        advance: !0
    },
    {
        id: "2",
        u: "2 Team",
        advance: !0,
        end: "2TDM"
    },
    {
        id: "3",
        u: "3 Team",
        advance: !0,
        end: "3TDM"
    },
    {
        id: "4",
        u: "4 Team",
        advance: !0,
        end: "4TDM"
    }
    ],
    [{
        id: "d",
        u: "Domination"
    },
    {
        id: "m",
        u: "Mothership",
        remove: "2"
    },
    {
        id: "a",
        u: "Assault",
        remove: ["2", "m"]
    },
    {
        id: "s",
        u: "Siege",
        remove: "1"
    },
    {
        id: "t",
        u: "Tag",
        remove: ["o", "4"]
    },
    {
        id: "p",
        u: "Pandemic",
        remove: ["o", "2"]
    },
    {
        id: "z",
        u: "Sandbox"
    }
    ]
];
const regionTable = {
    xyz: ["Local", "Localhost", null],
    unk: ["Unknown", "Unknown", null],
    svx: ["US West", "Silicon Valley, CA, US", -7],
    lax: ["US West", "Los Angeles, CA, US", -7],
    dal: ["USA", "Dallas, TX, US", -5],
    kci: ["USA",
        "Kansas City, MO, US", -5
    ],
    vin: ["US East", "Vint Hill, VA, US", -4],
    mtl: ["US East", "Montreal, CA", -4],
    lon: ["Europe", "London, UK", 1],
    fra: ["Europe", "Frankfurt, DE", 2],
    fsn: ["Europe", "Falkenstein, DE", 2],
    sgp: ["Asia", "Singapore", 8]
};
const hostTable = {
    z: ["Private", null],
    x: ["Local", null],
    glitch: ["Glitch", 10],
    buyvm: ["BuyVM", 15],
    extravm: ["ExtraVM", 40],
    hetzner: ["Hetzner", 50],
    ovh: ["OVH", 45],
    wsi: ["WSI", 50],
    vultr: ["Vultr", 30]
}

class Server {
    /**
     * @param {GameServerData} raw Raw server from response
     */
    constructor(raw) {
        this._raw = raw;

        this._resolve();
    }
    /**
     * Parses the server and stores static stuf
     * @private
     */
    _resolve() {
        /**
         * Total client count in the server
         * @type {number}
         * @readonly
         */
        this.clients = this._raw.clients;
        /**
         * Server uptime - in seconds
         * @type {number}
         * @readonly
         */
        this.uptime = this._raw.uptime;
        /**
         * Determines if the server is online
         * @type {boolean}
         * @readonly
         */
        this.online = this._raw.online;
        /**
         * Server Hash, used to retrieve link
         * @type {string}
         * @readonly
         */
        this.hash = this._raw.hash;
        /**
         * Milliseconds per tick
         * @type {number}
         * @readonly
         */
        this.mspt = this._raw.mspt;
        /**
         * Ticks per second
         * @type {number}
         * @readonly
         */
        this.tps = 1000 / this._raw.mspt;
        /**
         * Server host / address, used for connection
         * @type {string}
         * @readonly
         */
        this.host = this._raw.host;
        /**
         * Raw server code
         * @type {string}
         * @readonly
         */
        this.code = this._raw.code;

        const [provider, region, gamemode] = this.code.split('-');

        /**
         * Server gamemodes, joined by a space
         * @type {string}
         * @readonly
         */
        this.gamemode = Server.parseGamemode(gamemode);
        /**
         * Server region, not precise
         * @type {string}
         * @readonly
         */
        this.region = Server.parseRegion(region);
        /**
         * Server provider, in short
         * @type {string}
         * @readonly
         */
        this.provider = Server.parseHost(provider);
        /**
         * Server name, made of gamemodes, regions and server hosts
         * @type {string}
         * @readonly
         */
        this.name = [this.provider, this.region, this.gamemode].join(' - ')
    }

    /**
     * Parses a gamemode section code to gamemode names
     * 
     * @param {string} code gamemode code, third element in the host-region-gamemode code
     * @returns {string}
     */
    static parseGamemode(code) {
        if ("%" === code) return "Unknown";
        let tags = [];
        let filter = [];
        let at = 0;

        for (const games of gamemodeTable) {
            for (const game of games) {
                if (game.id === code.charAt(at)) {
                    if (Array.isArray(game.remove)) {
                        filter.push.apply(filter, game.remove);
                    } else if (game.remove) {
                        filter.push(game.remove);
                    }
                    tags.push(Object.assign({}, game));
                    at++;
                    break;
                }
            }
        }
        if (tags.length == 0) return "Unknown";

        return tags.map((n, i, l) => l[Math.min(i + Math.pow(-1, i), l.length - 1)]).filter(({ id }) => !filter.includes(id)).map(data => data.u).join(" ");
    }
    /**
     * Parses a region section code to region names
     * 
     * @param {string} code region code, second element in the host-region-gamemode code
     * @returns {string}
     */
    static parseRegion(code) {
        return regionTable[code][0]
    }
    /**
     * Parses a server host section code to server host names
     * 
     * @param {string} code server host code, first element in the host-region-gamemode code
     * @returns {string}
     */
    static parseHost(code) {
        return hostTable[code][0]
    }
    /**
     * Parses all parts of the host-region-gamemode code
     * @param {code} code host-region-gamemode code
     * @returns {string}
     */
    static parseCode(code) {
        const [host, region, gamemode] = code.split('-');

        return [Server.parseHost(host), Server.parseRegion(region), Server.parseGamemode(gamemode)].join(' - ')
    }
}

module.exports = Server;
