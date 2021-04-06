const API = require('./api');
const Game = require('./game');

class Client {
    constructor(options = {}) {
        /**
         * Game interactor
         * @type {Game}
         */
        this.game = new Game(options.gameOptions || {});
        /**
         * API interactor
         * @type {API}
         */
        this.api = new API(options.apiOptions || {});
    }
}

Client.Game = Game;
Client.API = API;
Client.Socket = require('./net')

module.exports = Client;