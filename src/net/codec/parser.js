const rotator = require('./util')

class BroadcastParser {
    constructor() {
        this.leaderboard = [];
        this.teamMinimap = [];
        this.globalMinimap = [];
    }

    /**
     * Parsed decoded broadcast packet data
     * @param {Array} packet decoded data
     * @returns {Object} parsed data
     */
    parse(packet) {
        const rot = rotator(packet);

        if (rot.nex() !== 'b') throw new TypeError('Invalid packet header; expected packet `b`');

        this._array(rot, () => {
            const del = rot.nex();

            this.globalMinimap.remove(this.globalMinimap.findIndex(({ id }) => id === del));
        });

        this._array(rot, () => {
            const dot = {
                id: rot.nex(),
                type: rot.nex(),
                x: rot.nex(),
                y: rot.nex(),
                color: rot.nex(),
                size: rot.nex()
            };

            let index = this.globalMinimap.findIndex(({ id }) => id === dot.id);
            if (index === -1) index = this.globalMinimap.length;

            this.globalMinimap[index] = dot;
        });

        this._array(rot, () => {
            const del = rot.nex();

            this.teamMinimap.remove(this.teamMinimap.findIndex(({ id }) => id === del));
        });

        this._array(rot, () => {
            const dot = {
                id: rot.nex(),
                x: rot.nex(),
                y: rot.nex(),
                size: rot.nex()
            };

            let index = this.teamMinimap.findIndex(({ id }) => id === dot.id);
            if (index === -1) index = this.teamMinimap.length;

            this.teamMinimap[index] = dot;
        });

        this._array(rot, () => {
            const del = rot.nex();

            this.leaderboard.remove(this.leaderboard.findIndex(({ id }) => id === del));
        });

        this._array(rot, () => {
            const champ = {
                id: rot.nex(),
                score: rot.nex(),
                index: rot.nex(),
                name: rot.nex(),
                color: rot.nex(),
                barColor: rot.nex()
            };

            let index = this.leaderboard.findIndex(({ id }) => id === champ.id);
            if (index === -1) index = this.leaderboard.length;

            this.leaderboard[index] = champ;
        });

        this.leaderboard.sort((c1, c2) => c2.score - c1.score);

        return this;
    }

    /**
     * @private
     */
    _array(rot, read, length = rot.nex()) {
        const out = Array(Math.max(0, length));

        for (let i = 0; i < length; ++i) out[i] = read.call(this, i, rot);

        return out;
    }
}

class UpdateParser {
    /**
     * @param {boolean} [doEntities] Whether or not to parse entities
     */
    constructor(doEntities = true) {
        this.camera = { x: null, y: null, vx: null, vy: null, fov: null };
        this.now = 0;
        this.player = {
            fps: 1,
            body: {
                type: null,
                color: null,
                id: null,
            },
            score: null,
            points: null,
            upgrades: [],
            stats: [],
            skills: null,
            accel: null,
            top: null,
            party: null
        }
        this.entities = doEntities ? [] : false;
    }
    /**
     * Parsed decoded update packet data
     * @param {Array} packet decoded data
     * @returns {Object} parsed data
     */
    parse(packet) {
        const rot = rotator(packet);

        if (rot.nex() !== 'u') throw new TypeError('Invalid packet header; expected packet `u`');

        this.now = rot.nex();

        const version = this.now === 0 ? 2 : 1;

        this.camera.x = rot.nex();
        this.camera.y = rot.nex();
        this.camera.fov = rot.nex();
        this.camera.vx = rot.nex();
        this.camera.vy = rot.nex();

        const flags = rot.nex();
        if (flags & 0x0001) this.player.fps = rot.nex();
        if (flags & 0x0002) {
            this.player.body.type = rot.nex();
            this.player.body.color = rot.nex();
            this.player.body.id = rot.nex();
        }
        if (flags & 0x0004) this.player.score = rot.nex();
        if (flags & 0x0008) this.player.points = rot.nex();
        if (flags & 0x0010) this.player.upgrades = Array(Math.max(0, rot.nex())).fill(-1).map(() => rot.nex());
        if (flags & 0x0020) this.player.stats = Array(30).fill(0).map(() => rot.nex());
        if (flags & 0x0040) {
            // Thank you Ponyo
            const result = rot.nex();

            this.player.skills = [
                (result / 0x1000000000 & 15),
                (result / 0x0100000000 & 15),
                (result / 0x0010000000 & 15),
                (result / 0x0001000000 & 15),
                (result / 0x0000100000 & 15),
                (result / 0x0000010000 & 15),
                (result / 0x0000001000 & 15),
                (result / 0x0000000100 & 15),
                (result / 0x0000000010 & 15),
                (result / 0x0000000001 & 15)
            ]
        }
        if (flags & 0x0080) this.player.accel = rot.nex();
        if (flags & 0x0100) this.player.top = rot.nex();
        if (flags & 0x0200) this.player.party = rot.nex();
        if (flags & 0x0400) this.player.speed = rot.nex();

        if (version === 2 && this.entities !== false) {
            this._parseEnts(rot)
        } else if (version !== 2 && this.entities !== false) {
            this.entities = false;
            console.error('Invalid version, expected version 2. Disabling entities');
        }
        return this;
    }
    /**
     * @private
     */
    _table(rot, read) {
        const out = [];
        for (let id = rot.nex(); id !== -1; id = rot.nex()) {
            out[out.length] = read.call(this, id, rot)
        }
        return out
    }
    /**
     * @private
     */
    _parseEnts(rot) {
        if (rot.nex() !== -1) return console.warn('uhhhh-cancelling', rot.arr);

        // deletes
        this._table(rot, (id) => {
            const index = this.entities.findIndex(ent => ent.id === id);
            if (index === -1) {
                return console.warn('Possible desync, deletion of non existant entity ' + id, this.entities.findIndex(ent => ent.id2 === id), JSON.stringify(this.entities));
            }
            this.entities[index] = this.entities[this.entities.length - 1]
            --this.entities.length;
        });
        // update / creations
        this._table(rot, (id) => {
            let index = this.entities.findIndex(ent => ent.id === id)
            if (index === -1) this.entities[index = this.entities.length] = { id };

            const ent = this.entities[index];
            this._parseEnt(ent, rot)
        });
    }
    /**
 * @private
 */
    _parseEnt(ent, rot) {
        // if (ent === undefined) ent = {};
        const flags = rot.nex();
        if (!ent) console.log(this.entities.length, rot.get(rot.i - 1));
        if (flags & 0x0001) {
            let { x: lastX, y: lastY } = ent;
            ent.x = rot.nex() * 0.0625;
            ent.y = rot.nex() * 0.0625;
            if (typeof lastX !== 'undefined') {
                ent.vx = (ent.x - lastX);
                ent.vy = (ent.y - lastY);
            } else ent.vx = ent.vy = 0;
        }
        if (flags & 0x0002) ent.facing = rot.nex() * (360 / 256); // degrees instead of radians
        if (flags & 0x0004) ent.flags = rot.nex();
        if (flags & 0x0008) ent.health = rot.nex() / 255;
        if (flags & 0x0010) ent.shield = Math.max(0, rot.nex() / 255);
        if (flags & 0x0020) ent.alpha = rot.nex() / 255;
        if (flags & 0x0040) ent.size = rot.nex() * 0.0625;
        if (flags & 0x0080) ent.score = rot.nex();
        if (flags & 0x0100) ent.name = rot.nex();
        if (flags & 0x0200) ent.id2 = rot.nex();
        if (flags & 0x0400) ent.color = rot.nex();
        if (flags & 0x0800) ent.layer = rot.nex();
        if (flags & 0x1000) {
            if (!ent.guns) ent.guns = []

            this._table(rot, (index) => {
                const flag = rot.nex();
                if (!ent.guns[index]) ent.guns[index] = {};
                if (flag & 1) ent.guns[index].time = rot.nex();
                if (flag & 2) ent.guns[index].power = Math.sqrt(rot.nex()) / 20;
            });
        }
        if (flags & 0x2000) {
            if (!ent.turrets) ent.turrets = [];

            ent.turrets = this._table(rot, (index) => {
                let i = ent.turrets.findIndex(ent => ent.index === index)
                if (i === -1) ent.turrets[i = ent.turrets.length] = { index };
                const turret = ent.turrets[i];

                return this._parseEnt(turret, rot);
            });
        }

        return ent;
    }
}


module.exports = { BroadcastParser, UpdateParser }