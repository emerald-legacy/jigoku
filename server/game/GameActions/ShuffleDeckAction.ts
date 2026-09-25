import type { AbilityContext } from '../AbilityContext.js';
import { Location } from '../Constants.js';
import type { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { ActionEvent } from './GameAction.js';
export interface ShuffleDeckProperties extends PlayerActionProperties {
    deck: Location;
}

export class ShuffleDeckAction<C extends AbilityContext = AbilityContext> extends PlayerAction<ShuffleDeckProperties, EventName, C> {
    declare defaultProperties: ShuffleDeckProperties;

    name = 'refill';
    effect = 'refill its province faceup';
    constructor(propertyFactory: ShuffleDeckProperties | ((context: C) => ShuffleDeckProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    eventHandler(event: ActionEvent<EventName.Unnamed, C>, additionalProperties: Record<string, unknown> = {}): void {
        let { deck } = this.getProperties((event.context), additionalProperties);
        const player = event.player as Player;
        if(deck === Location.ConflictDeck) {
            player.shuffleConflictDeck();
        } else if(deck === Location.DynastyDeck) {
            player.shuffleDynastyDeck();
        }
    }
}
