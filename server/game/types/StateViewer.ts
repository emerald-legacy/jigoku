import type { AnonymousSpectator } from '../AnonymousSpectator.js';
import type Player from '../Player.js';
import type { Spectator } from '../Spectator.js';

/** Whoever a game state is rendered for: a player, a spectator, or an anonymous spectator. */
export type StateViewer = Player | Spectator | AnonymousSpectator;
