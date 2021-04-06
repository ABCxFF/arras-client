"use strict";

console.log('Connecting to a random sbx server');
(async () => {
    const ArrasClient = require('..')

    const arras = new ArrasClient();
    const servers = await arras.api.fetchServers()
    const server = servers.filterByGamemode('Sandbox')
        .filterByRegion('USA')
        .filter(server => server.clients === 0)[0] // empty sbxs only

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
