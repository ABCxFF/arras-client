"use strict";

console.log('Connecting to server via link');
(async () => {
    const ArrasClient = require('..')

    const arras = new ArrasClient();
    const servers = await arras.api.fetchServers()
    const server = servers.get('#oa'); // modifiable
    if (!server) {
        console.error('Invalid server')
        process.exit(0);
    }

    console.log('Connecting to https://arras.io/' + server.hash);

    const player = arras.game.connect(server);

    player.once('connected', async () => {

        console.log('Alive, and in game')

        await player.spawn('SBX Works', /* party id, so like 1239 (not link) */);

        player.levelUp(40);
        player.moveTo(0, 0);
    });

    player.once('close', () => console.log('Socket closing'));

    player.on('kick', (msg) => {
        console.error('Being kicked, msg', msg)
    })
})();
