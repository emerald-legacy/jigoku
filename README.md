# Jigoku

[![DeepWiki Architecture Documentation](https://deepwiki.com/badge.svg)](https://deepwiki.com/emerald-legacy/jigoku)

Web based implementation of The Legend of the Five Rings LCG

## FAQ

### What is it?

This is the repository for the game server which is running on [jigoku.online](https://jigoku.online/) allowing people to play L5R LCG online using only their browser.

### Can I contribute?

Sure! The code is written in TypeScript (server) and uses Jasmine for testing. Feel free to make suggestions, implement new cards, refactor bits of the code, raise pull requests or submit bug reports.

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to me before engaging in any big refactors.

If you're not coding inclined, then just playing games on the site and reporting bugs and issues that you find is a big help.

### How do I do X Y Z?

Check out the [About page](https://jigoku.online/about) of a Jigoku live deployment.

## Development

#### Required Software
* Git
* Node.js 26+

The game server needs no database; MongoDB belongs to the lobby (`jigoku-client`).

#### Getting Started

```
git clone <repo>
npm install
npx tsc
node build/server/gamenode
```

The game server communicates with the lobby server via WebSocket. Configure the connection using environment variables (validated via Zod in `server/env.ts`):

| Variable | Description |
|----------|-------------|
| `LOBBY_WS_URL` | WebSocket URL for lobby (e.g. `ws://lobby:6100`) |
| `GAME_NODE_NAME` | Node identity (e.g. `node-1`) |
| `GAME_NODE_SOCKET_IO_PORT` | Socket.IO port for player connections (e.g. `9500`) |
| `GAME_NODE_PROXY_PORT` | Optional. External port advertised to the lobby (e.g. `443`); defaults to the Socket.IO port |
| `DOMAIN` | Site domain |
| `SECRET` | JWT secret shared with the lobby |
| `HTTPS` | `true` or `false` |
| `ENVIRONMENT` | Environment name, also used in the game report URL (e.g. `production`; `npm run jasmine` uses `test`) |
| `LOBBY_PORT` | Lobby port number |
| `MAX_GAMES` | Optional. Games this node accepts, default `20` |
| `NODE_SECRET` | Optional. Secret sent to the lobby when the node connects |
| `GAME_NODE_CERT_PATH`, `GAME_NODE_KEY_PATH` | Optional. TLS certificate and key for the node itself |
| `BUILD_VERSION` | Optional. Version reported to the lobby, default `LOCAL` |
| `ANALYTICS_URL` | Optional. Game report endpoint; defaults to the analytics engine, empty disables the reports |

See `server/env.ts` for the definitions.

### Coding Guidelines

All code should pass linting (ESLint flat config) with no errors or warnings:

```
npm run lint
```

All tests should also pass:

```
npm test
```

`npm test` runs the whole suite in parallel. To run a few spec files in one process (specs live in `test/server/`, card specs in `test/server/cards/<pack>/`):

```
npm run jasmine -- test/server/cards/01-Core/AdeptOfShadows.spec.js
```

TypeScript type checking (the server and the specs):

```
npm run typecheck
```

If you are making any game engine changes, these will not be accepted without unit tests to cover them.

### Writing cards

Cards live in `server/game/cards/<pack>/` and are written with the ability builder. The reference for it (builder methods, game actions, effects, costs, events and helpers) is the docs site in `docs/`: open `docs/index.html` in a browser. Card specs use the `integration()` helper and `this.setupTest()`; see the existing specs in `test/server/cards/`.

### Discord Discussion
[Jigoku Discord Server](https://discord.gg/tMzhyND)
