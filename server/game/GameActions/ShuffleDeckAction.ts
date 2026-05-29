import type { AbilityContext } from '../AbilityContext.js';
import { Locations } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { Event } from '../Events/Event.js';
export interface ShuffleDeckProperties extends PlayerActionProperties {
    deck: Locations;
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

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        let { deck } = this.getProperties((event.context as AbilityContext), additionalProperties) as ShuffleDeckProperties;
        if(deck === Locations.ConflictDeck) {
            event.player.shuffleConflictDeck();
        } else if(deck === Locations.DynastyDeck) {
            event.player.shuffleDynastyDeck();
        }
    }
}
