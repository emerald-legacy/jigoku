import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Location } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';

export interface FillProvinceProperties extends PlayerActionProperties {
    location: Location;
    fillTo?: number;
    faceup?: boolean;
}

export class FillProvinceAction<C extends AbilityContext = AbilityContext> extends PlayerAction<FillProvinceProperties, EventName.Unnamed, C, 'location' | 'fillTo' | 'faceup'> {
    defaultProperties = { location: Location.ProvinceOne, fillTo: 1, faceup: false };
    name = 'fillProvince';
    effect = 'fills {0} with more cards';

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['fills {0} to {1} cards!', [this.getProperties(context, additionalProperties).fillTo]];
    }

    protected effectMessageTarget(context: C, additionalProperties: ActionOverrides = {}): MsgArg {
        return this.getProperties(context, additionalProperties).location;
    }

    eventHandler(event: PlayerEvent<EventName.Unnamed, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        const player = event.player;
        const currentCards = player.getDynastyCardsInProvince(properties.location).length;
        player.refillProvince(properties.location, properties.fillTo - currentCards);

        if(properties.faceup) {
            context.game.queueSimpleStep(() => {
                const cards = player.getDynastyCardsInProvince(properties.location);
                cards.forEach((card) => {
                    card.facedown = false;
                });
            });
        }
    }
}
