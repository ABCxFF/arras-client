const EventEmitter = require('events')
const WebSocket = require('ws');
const { configureDefault } = require('../util');

const { UpdateParser, BroadcastParser } = require('./codec/parser');
const coder = require('./codec/coder');
/**
 * @typedef {Object} SocketOptions
 */

const DEFAULT_OPTIONS = {

}

class Socket extends EventEmitter {
    /**
     * @param {SocketOptions} [options] Options for the socket
     * @param {Object} [wsOptions] Options, passed to the websocket
     */
    constructor(options = {}, wsOptions = {}) {
        super()
        this.options = options;
        this.wsOptions = wsOptions;
        /**
         * Determines whether the player can spawn - after 'w' packet
         * @type {Boolean}
         */
        this.accepted = false;

        this._init();
    }
    /**
     * @private
     */
    _init() {
        /** 
         * @type {SocketOptions}
         * @readonly
         */
        this.options = configureDefault(this.options, DEFAULT_OPTIONS)
    }
    /**
     * Opens a socket to a server
     * @param {Server} server 
     */
    open(server) {
        /**
         * @property {Server} server Server of connection
         */
        this.server = server;
        /** 
         * @type {Object}
         * @readonly
         */
        this.ws = new WebSocket(`wss://${server.host}/?a=1`, ["arras.io#v0+ft2", "arras.io#v1+ft2"], {
            "rejectUnauthorized": false,
            "headers": {
                "accept-language": "en-US,en;q=0.9,es;q=0.8",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-gpc": "1",
            },
            ...this.wsOptions
        });
        this.ws.binaryType = 'arraybuffer';
        /**
         * @property {Object} parsers Update and broadcast parsers
         */
        this.parsers = {
            update: new UpdateParser(),
            broadcast: new BroadcastParser()
        }

        this.ws.on('open', () => {
            this.emit('open');
            this.talk('p', 1);
            this.talk('d', 1);

            this.talk('T', `{"type":"headless"}`);
            this.talk('k');
        });
        this.ws.on('error', (err) => this.emit('ws-error', err));
        this.ws.on('close', () => this.emit('close'));
        this.ws.on('message', (buf) => {
            const data = new Uint8Array(buf);

            const packet = coder.decode(data);
            this.emit('packet', packet)
        });

        // Deals with the connection
        this.on('packet', (packet) => {
            switch (packet[0]) {
                case "b":
                    this.emit('broadcast', this.parsers.broadcast.parse(packet));
                    break;
                case "K":
                    this.emit('kick', packet[1]);
                    break;
                case "F":
                    this.emit('death');
                    break
                case 'u':
                    this.emit('update', this.parsers.update.parse(packet));
                    this.talk('d', packet[1]);
                    break;
                case 'p':
                    this.talk('p', packet[1]);
                    break;
                case 'e':
                    console.error('Fatal Error - unable to respond to the `e`val packet. Terminating process', packet[1])
                    process.exit(0);
                case 'w':
                    if (packet[1] === 1) {
                        // this.talk('s', )
                        this.accepted = true;
                        this.emit('accept');
                    } else if (packet[1] === 2) {
                        console.error('Fatal Error - unable to solve recaptcha v3 (too many players in server). Terminating process', packet[1])
                        process.exit(0)
                    }

            }
        })
    }
    /**
     * Close the connection
     */
    close() {
        this.ws.terminate();
    }
    /**
     * Send data to the server - encoder
     * @param  {...any} data 
     */
    talk(...data) {
        this.ws.send(coder.encode(data))
    }
}
module.exports = Socket