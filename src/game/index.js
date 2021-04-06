const Player = require("./player");
const World = require('./world');
const Server = require('../api/server')
const { configureDefault } = require('../util');
const EventEmitter = require("events");
const Socket = require("../net");

/**
 * @typedef {Object} GameOptions
 * @property {Object} socketOptions Passed to the socket
 * @property {Object} wsOptions Passed to the ws
 */

const DEFAULT_OPTIONS = {
    socketOptions: {},
    wsOptions: {}
}


class Game extends EventEmitter {
    /**
     * @param {GameOptions} [options] Game creation options
     */
    constructor(options = {}) {
        super();
        this.options = configureDefault(options, DEFAULT_OPTIONS);
    }
    /**
     * @param {Server} server Server to connect to
     * @param {GameOptions} [options] Game creation options
     */
    connect(server, options = this.options) {
        this.options = configureDefault(options, DEFAULT_OPTIONS);
        this.server = server;
        /**
         * Core socket connection manager
         * @type {Socket}
         */
        this.socket = new Socket(this.options.socketOptions, this.options.wsOptions);
        this.socket.open(server);

        this.socket.on('death', () => this.emit('death'));
        this.socket.on('kick', (msg) => {
            this.emit('kick', msg)
            this.leave();
        });

        /**
         * Core parser for leaderboards and entities
         * @type {Socket}
         */
        this.world = new World(this.socket);
        /**
         * Core player
         * @type {Socket} 
         */
        this.player = new Player(this.world, this.socket);

        return this.player
    }

    leave() {
        this.socket.close();
        this.server = this.socket = this.world = this.player = null;
    }


}

module.exports = Game;