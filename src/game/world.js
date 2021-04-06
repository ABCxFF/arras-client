const EventEmitter = require("events");
const fetch = require("node-fetch");
const Socket = require("../net");

class World extends EventEmitter {
    /**
     * @param {Socket} socket 
     */
    constructor(socket) {
        super();
        this.socket = socket;
        this._up = socket.parsers.update;
        this._bp = socket.parsers.broadcast;

        this._wasAlive = false;

        this.socket.on('packet', (packet) => this._handle(packet))
        this._retrieveMockups();
    }
    /**
     * @private
     * @async
     */
    async _retrieveMockups() {
        if (!this.socket.server) return;

        this.mockups = await fetch(`https://${this.socket.server.host}/mockups.json`).then(res => res.json())
    }

    /**
     * @type {string} Gamemode abbreviation
     * @readonly
     */
    get gamemode() {
        if (this._gamemode) return this._gamemode;
        return this._gamemode = this._bp.globalMinimap.some((wall) => wall.type === 2 && wall.color === 16) ? 'maze' : this.room.zones.every(z => z.type === 'norm' || z.type === 'nest' || z.type === 'roid') ? 'open' : this.room.zones.some(z => z.type.includes('dom')) ? 'dom' : this.room.zones.some(z => z.type.includes('null')) ? 'siege' : this.room.zones.some(z => z.type.includes('port')) ? 'portal' : this.room.zones.some(z => z.type === 'bap4') ? '4tdm' : '2tdm';
    }
    /**
     * @type {string} All bases on the map (not dom (I think))
     * @readonly
     */
    get bases() {
        if (this._bases) return this._bases;
        return this._bases = this.room.zones.filter(z => z.type.startsWith('bap'));
    }
    /**
     * @type {Object|null} All bases of the player's team
     * @readonly
     */
    get selfBases() {
        if (this._up.player.party < 1) return null
        if (this._selfBases) return this._selfBases;
        return this._selfBases = this.room.zones.filter(z => z.type === 'bap' + this._up.player.party.toString()[0]);
    }
    /**
     * @type {Object}
     * @readonly
     */
    get selfEnt() {
        return this.findById(this._up.player.body.id);
    }
    /**
     * @type {Object}
     * @readonly
     */
    get topChamp() { return this._bp.leaderboard[0] }
    /**
     * @type {boolean}
     * @readonly
     */
    get isDead() { return !this.selfEnt }
    /**
     * @type {boolean}
     * @readonly
     */
    get isAlive() { return !!this.selfEnt }
    /**
     * Finds entity in the game by their id
     * @param {number} id id of specific entity
     * @returns {Object|null} Entity
     */
    findById(id) {
        return this._up.entities.find(ent => ent.id === id) || null;
    }

    _handle(packet) {
        if (packet[0] === 'F') {
            this._wasAlive = false;
        }
        if (packet[0] === 'u') {
            if (!this._wasAlive && this.isAlive) this.emit('spawn')
            return this.emit('tick')
        }
        if (packet[0] !== 'R') return;
        const R = packet;
        const width = (R[5] - R[3]) / 9;
        const height = (R[4] - R[6]) / 9
        const zones = JSON.parse(R[7]).map((row, y) => row.map((type, x) => ({
            type,
            width,
            height,
            x: x * width + R[3],
            y: y * height + R[4],
            mid: {
                x: x * width + R[3] + width / 2,
                y: y * height + R[4] - height / 2,
            }
        })));


        this.room = {
            speed: R[2]
        }
        this.room.zones = zones.flat();
    }
}

module.exports = World;