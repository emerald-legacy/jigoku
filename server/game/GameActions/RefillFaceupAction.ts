import type { AbilityContext } from '../AbilityContext.js';
import type { Locations } from '../Constants.js';
import type { EventNames } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface RefillFaceupProperties extends PlayerActionProperties {
    location: Locations | Locations[];
}

export class RefillFaceupAction extends PlayerAction {
    declare defaultProperties: RefillFaceupProperties;

    name = 'refill';
    effect = 'refill its province faceup';
    constructor(propertyFactory: RefillFaceupProperties | ((context: AbilityContext) => RefillFaceupProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    eventHandler(event: GameEvent<EventNames.Unnamed>, additionalProperties: Record<string, unknown> = {}): void {
        const context = event.context as AbilityContext;
        let { location } = this.getProperties(context, additionalProperties) as RefillFaceupProperties;
        if(!Array.isArray(location)) {
            location = [location];
        }

        const player = event.player as Player;
        location.forEach((loc) => {
            context.game.queueSimpleStep(() => {
                if(player.replaceDynastyCard(loc)) {
                    context.game.queueSimpleStep(() => {
                        let cards = player.getDynastyCardsInProvince(loc);
                        cards.forEach((card) => {
                            if(card) {
                                card.facedown = false;
                            }
                        });
                    });
                }
            });
        });
    }
}
