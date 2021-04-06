const EventEmitter = require("events");
const Socket = require("../net");
const World = require("./world");

class Player extends EventEmitter {
    /**
     * @param {World} world 
     * @param {Socket} socket
     */
    constructor(world, socket) {
        super();

        this.world = world;
        this.socket = socket;
        this.tick = 0; // updated every update - used for internal stuff too
        this.input = {
            flags: 0,
            x: 0,
            y: 0
        }
        this.target = null


        this._listen();
    }

    /**
     * @private
     */
    _listen() {
        this.socket.on('update', (data) => {
            this.emit('update', data)
            this.tick++
            if (this.target) this.moveTo(this.target)
        })
        this.world.on('spawn', () => this.emit('spawn'))
        this.socket.on('accept', (data) => this.emit('connected', data));
        this.socket.on('kick', (data) => this.emit('kick', data));
        this.socket.on('death', (data) => this.emit('death', data));
        this.socket.on('broadcast', (data) => this.emit('broadcast', data));

    }
    /**
     * Toggles shooting
     * @param {boolean} [shooting] Set shooting, by default it toggles though
     */
    toggleShoot(shooting = !(this.input.flags & 16)) {
        this.input.flags |= 16 * shooting
    }
    /**
     * Toggles repelling
     * @param {boolean} [repelling] Set repelling, by default it toggles though
     */
    toggleRepel(shooting = !(this.input.flags & 64)) {
        this.input.flags |= 64 * shooting
    }

    /**
     * Levels up the player
     * @param {number} [levels] Amount of levels to level up
     */
    levelUp(levels = 45) {
        for (let i = 0; i < levels; ++i) this.talk('L')
    }

    /**
     * Upgrades stats
     * @param {string} build
     * @example
     * player.upgradeStats("2/2/2/7/7/7/8/7/0/0");
     */
    upgradeStats(build) {
        build = build.split('/')
        for (let stat = 0; stat < build.length; ++stat) {
            let amount = build[stat];
            for (let z = 0; z < amount; ++z) {
                this.talk("x", stat);
            }
        }
    }

    /**
     * Upgrades you to a tank - assumption is you are basic tank
     * @param  {...string|number} path Tank path, list of names or numbers
     */
    upgradeTo(...path) {
        if (!this.mockups) throw new RangeError('No mockups loaded. Internal error');

        for (const t of path) {
            const id = typeof t === 'number' ? t : this.world.mockups.findIndex(def => def.name === t);
            if (id === -1) throw new TypeError('Invalid tank');
            this.talk('U', id)
        }
    }

    /**
     * Spanw into the game
     * @param {string} name Name for spawn
     * @param {number} [party] Party code
     * @param {string|boolean} [grecaptcha] The grecaptcha token to connect with. Required in player count 30+ servers 
     */
    spawn(name, party = -1, grecaptcha = false) {
        if (!this.socket.accepted) {
            this.socket.once('accept', () => this.spawn(name, party, grecaptcha))
        }
        if (grecaptcha) {
            return false
            this.talk('s', name, party, grecaptcha);
        } else this.talk('s', name, party);
        return new Promise(r => this.once('spawn', r));
    }

    /**
     * Send data to the server - encoder
     * @param  {...any} data 
     */
    talk(...data) {
        // replica of Socket.send
        this.socket.talk(...data)
    }

    /**
     * Sends an input / cmd packet
     * @param {number} x x pos
     * @param {number} y y pos
     * @param {number} flags bitwise input flags
     */
    sendInput(x, y, flags) {
        this.input = {
            x, y, flags
        }
        this.talk('C', x, y, flags)
    }

    /**
     * @readonly
     * @type {boolean}
     */
    get isAlive() {
        return this.world.isAlive
    }
    /**
     * @readonly
     * @type {boolean}
     */
    get isDead() {
        return this.world.isDead
    }

    /**
     * Sends a move to packe tto a specific location
     * @param {Object|number} target The target location
     * @param {number} target.x
     * @param {number} target.y
     * @param {number} [y] The y pos, if used this way
     */
    moveTo(target, y = false) {
        if (!this.world.isAlive) return;
        if (y !== false) target = {
            x: target,
            y: y
        }
        this.target = target;
        // Disclaimer, the following code may be ugly
        let dir = Math.round(Math.atan2(target.y - this.world.selfEnt.y, target.x - this.world.selfEnt.x) * 180 / Math.PI * (2 / 45)) * (45 / 2);
        dir = ((dir % 360) + 360) % 360; // keep positive in range
        this.input.flags &= ~15;
        return this.sendInput(target.x - this.world.selfEnt.x, target.y - this.world.selfEnt.y, (this.input.flags = ({
            "0": 0b1000, // 1 = down, 2 = up, 4 = left, 8 = right,
            "22.5": 0b1000 ^ ((this.tick & 1) << 1),
            "45": 0b1010,
            "67.5": 0b0010 ^ ((this.tick & 1) << 3),
            "90": 0b0010,
            "112.5": 0b0010 ^ ((this.tick & 1) << 2),
            "135": 0b0110,
            "157.5": 0b0100 ^ ((this.tick & 1) << 1),
            "180": 0b0100,
            "202.5": 0b0100 ^ ((this.tick & 1) << 0),
            "225": 0b0101,
            "247.5": 0b0001 ^ ((this.tick & 1) << 2),
            "270": 0b0001,
            "292.5": 0b0001 ^ ((this.tick & 1) << 3),
            "315": 0b1001,
            "337.5": 0b1000 ^ ((this.tick & 1) << 0)
        })[dir.toString()] | this.input.flags))
    }


}

module.exports = Player;