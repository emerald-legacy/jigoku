import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { Location } from '../Constants.js';
import type { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';

export interface RefillFaceupProperties extends PlayerActionProperties {
    location: Location | Location[];
}

export class RefillFaceupAction<C extends AbilityContext = AbilityContext> extends PlayerAction<RefillFaceupProperties, EventName.Unnamed, C> {
    name = 'refill';
    effect = 'refill its province faceup';

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    eventHandler(event: PlayerEvent<EventName.Unnamed, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        let { location } = this.getProperties(context, additionalProperties);
        if(!Array.isArray(location)) {
            location = [location];
        }

        const player = event.player;
        location.forEach((loc) => {
            context.game.queueSimpleStep(() => {
                if(player.replaceDynastyCard(loc)) {
                    context.game.queueSimpleStep(() => {
                        const cards = player.getDynastyCardsInProvince(loc);
                        cards.forEach((card) => {
                            card.facedown = false;
                        });
                    });
                }
            });
        });
    }
}
