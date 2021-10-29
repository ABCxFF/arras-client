## Classes

<dl>
<dt><a href="#API">API</a></dt>
<dd></dd>
<dt><a href="#Server">Server</a></dt>
<dd></dd>
<dt><a href="#ServerList">ServerList</a> ⇐ <code>Array</code></dt>
<dd></dd>
<dt><a href="#Game">Game</a></dt>
<dd></dd>
<dt><a href="#Player">Player</a></dt>
<dd></dd>
<dt><a href="#World">World</a></dt>
<dd></dd>
<dt><a href="#UpdateParser">UpdateParser</a></dt>
<dd></dd>
<dt><a href="#Socket">Socket</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#encode">encode(message)</a> ⇒ <code>Uint8Array</code></dt>
<dd><p>Encodes data - fast talk v2</p>
</dd>
<dt><a href="#decode">decode(packet)</a> ⇒ <code>Array</code></dt>
<dd><p>Decodes data - fast talk v2</p>
</dd>
<dt><a href="#rotator">rotator(packet)</a> ⇒</dt>
<dd><p>Generates a rotator around a packet</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#GameServerData">GameServerData</a> : <code>Object</code></dt>
<dd><p>Server as defined by api status / endpoint</p>
</dd>
<dt><a href="#GameOptions">GameOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SocketOptions">SocketOptions</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="API"></a>

## API
**Kind**: global class  

* [API](#API)
    * [new API([allowCache])](#new_API_new)
    * [.fetch(endpoint)](#API+fetch) ⇒ <code>Object</code>
    * [.fetchServers()](#API+fetchServers) ⇒ [<code>Promise.&lt;ServerList&gt;</code>](#ServerList)
    * [.fetchClientCount()](#API+fetchClientCount) ⇒ <code>Promise.&lt;number&gt;</code>

<a name="new_API_new"></a>

### new API([allowCache])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [allowCache] | <code>boolean</code> | <code>true</code> | Determines whether or not you allow request caching, defaults to `true` |

<a name="API+fetch"></a>

### apI.fetch(endpoint) ⇒ <code>Object</code>
Attempts to fetch an endpoint, if the first root server isn't available, it'll attempt the next

**Kind**: instance method of [<code>API</code>](#API)  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Endpoint it'll be request, part of the path |

<a name="API+fetchServers"></a>

### apI.fetchServers() ⇒ [<code>Promise.&lt;ServerList&gt;</code>](#ServerList)
Fetches all servers and returns a server list object

**Kind**: instance method of [<code>API</code>](#API)  
<a name="API+fetchClientCount"></a>

### apI.fetchClientCount() ⇒ <code>Promise.&lt;number&gt;</code>
Fetches the arras.io global client count

**Kind**: instance method of [<code>API</code>](#API)  
<a name="Server"></a>

## Server
**Kind**: global class  

* [Server](#Server)
    * [new Server(raw)](#new_Server_new)
    * _instance_
        * [.clients](#Server+clients) : <code>number</code>
        * [.uptime](#Server+uptime) : <code>number</code>
        * [.online](#Server+online) : <code>boolean</code>
        * [.hash](#Server+hash) : <code>string</code>
        * [.mspt](#Server+mspt) : <code>number</code>
        * [.tps](#Server+tps) : <code>number</code>
        * [.host](#Server+host) : <code>string</code>
        * [.code](#Server+code) : <code>string</code>
        * [.gamemode](#Server+gamemode) : <code>string</code>
        * [.region](#Server+region) : <code>string</code>
        * [.provider](#Server+provider) : <code>string</code>
        * [.name](#Server+name) : <code>string</code>
    * _static_
        * [.parseGamemode(code)](#Server.parseGamemode) ⇒ <code>string</code>
        * [.parseRegion(code)](#Server.parseRegion) ⇒ <code>string</code>
        * [.parseHost(code)](#Server.parseHost) ⇒ <code>string</code>
        * [.parseCode(code)](#Server.parseCode) ⇒ <code>string</code>

<a name="new_Server_new"></a>

### new Server(raw)

| Param | Type | Description |
| --- | --- | --- |
| raw | [<code>GameServerData</code>](#GameServerData) | Raw server from response |

<a name="Server+clients"></a>

### server.clients : <code>number</code>
Total client count in the server

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+uptime"></a>

### server.uptime : <code>number</code>
Server uptime - in seconds

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+online"></a>

### server.online : <code>boolean</code>
Determines if the server is online

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+hash"></a>

### server.hash : <code>string</code>
Server hash, used to retrieve link

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+mspt"></a>

### server.mspt : <code>number</code>
Milliseconds per tick

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+tps"></a>

### server.tps : <code>number</code>
Ticks per second

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+host"></a>

### server.host : <code>string</code>
Server host / address, used for connection

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+code"></a>

### server.code : <code>string</code>
Raw server code

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+gamemode"></a>

### server.gamemode : <code>string</code>
Server gamemodes, joined by a space

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+region"></a>

### server.region : <code>string</code>
Server region, not precise

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+provider"></a>

### server.provider : <code>string</code>
Server provider, in short

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server+name"></a>

### server.name : <code>string</code>
Server name, made of gamemodes, regions and server hosts

**Kind**: instance property of [<code>Server</code>](#Server)  
**Read only**: true  
<a name="Server.parseGamemode"></a>

### Server.parseGamemode(code) ⇒ <code>string</code>
Parses a gamemode section code to gamemode names

**Kind**: static method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | gamemode code, third element in the host-region-gamemode code |

<a name="Server.parseRegion"></a>

### Server.parseRegion(code) ⇒ <code>string</code>
Parses a region section code to region names

**Kind**: static method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | region code, second element in the host-region-gamemode code |

<a name="Server.parseHost"></a>

### Server.parseHost(code) ⇒ <code>string</code>
Parses a server host section code to server host names

**Kind**: static method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | server host code, first element in the host-region-gamemode code |

<a name="Server.parseCode"></a>

### Server.parseCode(code) ⇒ <code>string</code>
Parses all parts of the host-region-gamemode code

**Kind**: static method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>code</code> | host-region-gamemode code |

<a name="ServerList"></a>

## ServerList ⇐ <code>Array</code>
**Kind**: global class  
**Extends**: <code>Array</code>  

* [ServerList](#ServerList) ⇐ <code>Array</code>
    * [new ServerList(raw)](#new_ServerList_new)
    * [.get(hash)](#ServerList+get) ⇒ [<code>Server</code>](#Server)
    * [.filterByGamemode(...gamemodes)](#ServerList+filterByGamemode) ⇒ [<code>Array.&lt;Server&gt;</code>](#Server)
    * [.filterByRegion(region)](#ServerList+filterByRegion) ⇒ [<code>Array.&lt;Server&gt;</code>](#Server)
    * [.byHash(hash)](#ServerList+byHash) ⇒ [<code>Server</code>](#Server)

<a name="new_ServerList_new"></a>

### new ServerList(raw)

| Param | Type | Description |
| --- | --- | --- |
| raw | [<code>Array.&lt;GameServerData&gt;</code>](#GameServerData) | Raw server data - response from status/ |

<a name="ServerList+get"></a>

### serverList.get(hash) ⇒ [<code>Server</code>](#Server)
Selects server with the same hash

**Kind**: instance method of [<code>ServerList</code>](#ServerList)  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | Hash of selection |

<a name="ServerList+filterByGamemode"></a>

### serverList.filterByGamemode(...gamemodes) ⇒ [<code>Array.&lt;Server&gt;</code>](#Server)
Used to retrieve servers by their gamemode

**Kind**: instance method of [<code>ServerList</code>](#ServerList)  

| Param | Type | Description |
| --- | --- | --- |
| ...gamemodes | <code>string</code> | Gamemode strings, to be looked for in the `name` of the server |

<a name="ServerList+filterByRegion"></a>

### serverList.filterByRegion(region) ⇒ [<code>Array.&lt;Server&gt;</code>](#Server)
Retrieves all servers in a specific region

**Kind**: instance method of [<code>ServerList</code>](#ServerList)  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>string</code> | region of selection |

<a name="ServerList+byHash"></a>

### serverList.byHash(hash) ⇒ [<code>Server</code>](#Server)
Selects server with the same hash

**Kind**: instance method of [<code>ServerList</code>](#ServerList)  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | Hash of selection |

<a name="Game"></a>

## Game
**Kind**: global class  

* [Game](#Game)
    * [new Game([options])](#new_Game_new)
    * [.socket](#Game+socket) : [<code>Socket</code>](#Socket)
    * [.world](#Game+world) : [<code>Socket</code>](#Socket)
    * [.player](#Game+player) : [<code>Socket</code>](#Socket)
    * [.connect(server, [options])](#Game+connect)

<a name="new_Game_new"></a>

### new Game([options])

| Param | Type | Description |
| --- | --- | --- |
| [options] | [<code>GameOptions</code>](#GameOptions) | Game creation options |

<a name="Game+socket"></a>

### game.socket : [<code>Socket</code>](#Socket)
Core socket connection manager

**Kind**: instance property of [<code>Game</code>](#Game)  
<a name="Game+world"></a>

### game.world : [<code>Socket</code>](#Socket)
Core parser for leaderboards and entities

**Kind**: instance property of [<code>Game</code>](#Game)  
<a name="Game+player"></a>

### game.player : [<code>Socket</code>](#Socket)
Core player

**Kind**: instance property of [<code>Game</code>](#Game)  
<a name="Game+connect"></a>

### game.connect(server, [options])
**Kind**: instance method of [<code>Game</code>](#Game)  

| Param | Type | Description |
| --- | --- | --- |
| server | [<code>Server</code>](#Server) | Server to connect to |
| [options] | [<code>GameOptions</code>](#GameOptions) | Game creation options |

<a name="Player"></a>

## Player
**Kind**: global class  

* [Player](#Player)
    * [new Player(world, socket)](#new_Player_new)
    * [.isAlive](#Player+isAlive) : <code>boolean</code>
    * [.isDead](#Player+isDead) : <code>boolean</code>
    * [.toggleShoot([shooting])](#Player+toggleShoot)
    * [.toggleRepel([repelling])](#Player+toggleRepel)
    * [.levelUp([levels])](#Player+levelUp)
    * [.upgradeStats(build)](#Player+upgradeStats)
    * [.upgradeTo(...path)](#Player+upgradeTo)
    * [.spawn(name, [party], [grecaptcha])](#Player+spawn)
    * [.talk(...data)](#Player+talk)
    * [.sendInput(x, y, flags)](#Player+sendInput)
    * [.moveTo(target, [y])](#Player+moveTo)

<a name="new_Player_new"></a>

### new Player(world, socket)

| Param | Type |
| --- | --- |
| world | [<code>World</code>](#World) | 
| socket | [<code>Socket</code>](#Socket) | 

<a name="Player+isAlive"></a>

### player.isAlive : <code>boolean</code>
**Kind**: instance property of [<code>Player</code>](#Player)  
**Read only**: true  
<a name="Player+isDead"></a>

### player.isDead : <code>boolean</code>
**Kind**: instance property of [<code>Player</code>](#Player)  
**Read only**: true  
<a name="Player+toggleShoot"></a>

### player.toggleShoot([shooting])
Toggles shooting

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| [shooting] | <code>boolean</code> | Set shooting, by default it toggles though |

<a name="Player+toggleRepel"></a>

### player.toggleRepel([repelling])
Toggles repelling

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| [repelling] | <code>boolean</code> | Set repelling, by default it toggles though |

<a name="Player+levelUp"></a>

### player.levelUp([levels])
Levels up the player

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [levels] | <code>number</code> | <code>45</code> | Number of levels to level up |

<a name="Player+upgradeStats"></a>

### player.upgradeStats(build)
Upgrades stats

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type |
| --- | --- |
| build | <code>string</code> | 

**Example**  
```js
player.upgradeStats("2/2/2/7/7/7/8/7/0/0");
```
<a name="Player+upgradeTo"></a>

### player.upgradeTo(...path)
Upgrades you to a tank - assumption is you are basic tank

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| ...path | <code>string</code> \| <code>number</code> | Tank path, list of names or numbers |

<a name="Player+spawn"></a>

### player.spawn(name, [party], [grecaptcha])
Spawn into the game

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | Name for spawn |
| [party] | <code>number</code> |  | Party code |
| [grecaptcha] | <code>string</code> \| <code>boolean</code> | <code>false</code> | The grecaptcha token to connect with. Required in player count 30+ servers |

<a name="Player+talk"></a>

### player.talk(...data)
Send data to the server - encoder

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type |
| --- | --- |
| ...data | <code>any</code> | 

<a name="Player+sendInput"></a>

### player.sendInput(x, y, flags)
Sends an input / cmd packet

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | x pos |
| y | <code>number</code> | y pos |
| flags | <code>number</code> | bitwise input flags |

<a name="Player+moveTo"></a>

### player.moveTo(target, [y])
Sends a move to packet to a specific location

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> \| <code>number</code> | The target location |
| target.x | <code>number</code> |  |
| target.y | <code>number</code> |  |
| [y] | <code>number</code> | The y pos, if used this way |

<a name="World"></a>

## World
**Kind**: global class  

* [World](#World)
    * [new World(socket)](#new_World_new)
    * [.gamemode](#World+gamemode) : <code>string</code>
    * [.bases](#World+bases) : <code>string</code>
    * [.selfBases](#World+selfBases) : <code>Object</code> \| <code>null</code>
    * [.selfEnt](#World+selfEnt) : <code>Object</code>
    * [.topChamp](#World+topChamp) : <code>Object</code>
    * [.isDead](#World+isDead) : <code>boolean</code>
    * [.isAlive](#World+isAlive) : <code>boolean</code>
    * [.findById(id)](#World+findById) ⇒ <code>Object</code> \| <code>null</code>

<a name="new_World_new"></a>

### new World(socket)

| Param | Type |
| --- | --- |
| socket | [<code>Socket</code>](#Socket) | 

<a name="World+gamemode"></a>

### world.gamemode : <code>string</code>
Gamemode abbreviation

**Kind**: instance property of [<code>World</code>](#World)  
**Read only**: true  
<a name="World+bases"></a>

### world.bases : <code>string</code>
All bases on the map (not dom (I think))

**Kind**: instance property of [<code>World</code>](#World)  
**Read only**: true  
<a name="World+selfBases"></a>

### world.selfBases : <code>Object</code> \| <code>null</code>
All bases of the player's team

**Kind**: instance property of [<code>World</code>](#World)  
**Read only**: true  
<a name="World+selfEnt"></a>

### world.selfEnt : <code>Object</code>
**Kind**: instance property of [<code>World</code>](#World)  
**Read only**: true  
<a name="World+topChamp"></a>

### world.topChamp : <code>Object</code>
**Kind**: instance property of [<code>World</code>](#World)  
**Read only**: true  
<a name="World+isDead"></a>

### world.isDead : <code>boolean</code>
**Kind**: instance property of [<code>World</code>](#World)  
**Read only**: true  
<a name="World+isAlive"></a>

### world.isAlive : <code>boolean</code>
**Kind**: instance property of [<code>World</code>](#World)  
**Read only**: true  
<a name="World+findById"></a>

### world.findById(id) ⇒ <code>Object</code> \| <code>null</code>
Finds entity in the game by their id

**Kind**: instance method of [<code>World</code>](#World)  
**Returns**: <code>Object</code> \| <code>null</code> - Entity  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | id of specific entity |

<a name="UpdateParser"></a>

## UpdateParser
**Kind**: global class  

* [UpdateParser](#UpdateParser)
    * [new UpdateParser([doEntities])](#new_UpdateParser_new)
    * [.parse(packet)](#UpdateParser+parse) ⇒ <code>Object</code>

<a name="new_UpdateParser_new"></a>

### new UpdateParser([doEntities])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [doEntities] | <code>boolean</code> | <code>true</code> | Whether or not to parse entities |

<a name="UpdateParser+parse"></a>

### updateParser.parse(packet) ⇒ <code>Object</code>
Parsed decoded update packet data

**Kind**: instance method of [<code>UpdateParser</code>](#UpdateParser)  
**Returns**: <code>Object</code> - parsed data  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Array</code> | decoded data |

<a name="Socket"></a>

## Socket
**Kind**: global class  

* [Socket](#Socket)
    * [new Socket([options], [wsOptions])](#new_Socket_new)
    * [.accepted](#Socket+accepted) : <code>Boolean</code>
    * [.options](#Socket+options) : [<code>SocketOptions</code>](#SocketOptions)
    * [.server](#Socket+server)
    * [.ws](#Socket+ws) : <code>Object</code>
    * [.parsers](#Socket+parsers)
    * [.open(server)](#Socket+open)
    * [.close()](#Socket+close)
    * [.talk(...data)](#Socket+talk)

<a name="new_Socket_new"></a>

### new Socket([options], [wsOptions])

| Param | Type | Description |
| --- | --- | --- |
| [options] | [<code>SocketOptions</code>](#SocketOptions) | Options for the socket |
| [wsOptions] | <code>Object</code> | Options, passed to the websocket |

<a name="Socket+accepted"></a>

### socket.accepted : <code>Boolean</code>
Determines whether the player can spawn - after 'w' packet

**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+options"></a>

### socket.options : [<code>SocketOptions</code>](#SocketOptions)
**Kind**: instance property of [<code>Socket</code>](#Socket)  
**Read only**: true  
<a name="Socket+server"></a>

### socket.server
**Kind**: instance property of [<code>Socket</code>](#Socket)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| server | [<code>Server</code>](#Server) | Server of connection |

<a name="Socket+ws"></a>

### socket.ws : <code>Object</code>
**Kind**: instance property of [<code>Socket</code>](#Socket)  
**Read only**: true  
<a name="Socket+parsers"></a>

### socket.parsers
**Kind**: instance property of [<code>Socket</code>](#Socket)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| parsers | <code>Object</code> | Update and broadcast parsers |

<a name="Socket+open"></a>

### socket.open(server)
Opens a socket to a server

**Kind**: instance method of [<code>Socket</code>](#Socket)  

| Param | Type |
| --- | --- |
| server | [<code>Server</code>](#Server) | 

<a name="Socket+close"></a>

### socket.close()
Close the connection

**Kind**: instance method of [<code>Socket</code>](#Socket)  
<a name="Socket+talk"></a>

### socket.talk(...data)
Send data to the server - encoder

**Kind**: instance method of [<code>Socket</code>](#Socket)  

| Param | Type |
| --- | --- |
| ...data | <code>any</code> | 

<a name="encode"></a>

## encode(message) ⇒ <code>Uint8Array</code>
Encodes data - fast talk v2

**Kind**: global function  
**Returns**: <code>Uint8Array</code> - encoded data  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Array</code> | Message data |

<a name="decode"></a>

## decode(packet) ⇒ <code>Array</code>
Decodes data - fast talk v2

**Kind**: global function  
**Returns**: <code>Array</code> - Parsed data  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>ArrayBuffer</code> \| <code>Uint8Array</code> | Encoded data |

<a name="rotator"></a>

## rotator(packet) ⇒
Generates a rotator around a packet

**Kind**: global function  
**Returns**: rotator  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>Array</code> | Array of data in any type |

<a name="GameServerData"></a>

## GameServerData : <code>Object</code>
Server as defined by api status / endpoint

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| clients | <code>number</code> | The total client count on the server |
| uptime | <code>number</code> | The server's uptime in seconds |
| online | <code>boolean</code> | Indicates if the server is online or not |
| mspt | <code>number</code> | The milliseconds per tick, server speed check |
| host | <code>string</code> | The host url / address, used for connection |
| code | <code>string</code> | Raw server code, containing server provider-region-gamemode |
| [hash] | <code>string</code> | The server's hash, used for the server link |

<a name="GameOptions"></a>

## GameOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| socketOptions | <code>Object</code> | Passed to the socket |
| wsOptions | <code>Object</code> | Passed to the ws |

<a name="SocketOptions"></a>

## SocketOptions : <code>Object</code>
**Kind**: global typedef  
