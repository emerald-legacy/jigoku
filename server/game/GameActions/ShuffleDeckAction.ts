import type { AbilityContext } from '../AbilityContext.js';
import { Location } from '../Constants.js';
import type { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface ShuffleDeckProperties extends PlayerActionProperties {
    deck: Location;
}

export class ShuffleDeckAction extends PlayerAction {
    declare defaultProperties: ShuffleDeckProperties;

    name = 'refill';
    effect = 'refill its province faceup';
    constructor(propertyFactory: ShuffleDeckProperties | ((context: AbilityContext) => ShuffleDeckProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    eventHandler(event: GameEvent<EventName.Unnamed>, additionalProperties: Record<string, unknown> = {}): void {
        let { deck } = this.getProperties((event.context as AbilityContext), additionalProperties) as ShuffleDeckProperties;
        const player = event.player as Player;
        if(deck === Location.ConflictDeck) {
            player.shuffleConflictDeck();
        } else if(deck === Location.DynastyDeck) {
            player.shuffleDynastyDeck();
        }
    }
}
