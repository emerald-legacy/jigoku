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
* Node.js 22+
* MongoDB 7
* TypeScript

#### Getting Started

```
git clone <repo>
npm install
tsc
node build/server/gamenode
```

The game server communicates with the lobby server via WebSocket. Configure the connection using environment variables (validated via Zod in `server/env.ts`):

| Variable | Description |
|----------|-------------|
| `LOBBY_WS_URL` | WebSocket URL for lobby (e.g. `ws://lobby:6000`) |
| `GAME_NODE_NAME` | Node identity (e.g. `node-1`) |
| `GAME_NODE_SOCKET_IO_PORT` | Socket.IO port for player connections (e.g. `9500`) |
| `GAME_NODE_PROXY_PORT` | External port advertised to lobby (e.g. `443`) |
| `DB_PATH` | MongoDB connection string |
| `DOMAIN` | Site domain |
| `SECRET` | Session secret |
| `HTTPS` | `true` or `false` |
| `ENVIRONMENT` | `production` or `development` |
| `LOBBY_PORT` | Lobby port number |

See `server/env.ts` for the full list of supported environment variables.

### Coding Guidelines

All code should pass linting (ESLint flat config) with no errors or warnings:

```
npm run lint
```

All tests should also pass:

```
npm test
```

TypeScript type checking:

```
npm run typecheck
```

If you are making any game engine changes, these will not be accepted without unit tests to cover them.

### Discord Discussion
[Jigoku Discord Server](https://discord.gg/tMzhyND)
