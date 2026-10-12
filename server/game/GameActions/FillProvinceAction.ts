import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Location } from '../Constants.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';

export interface FillProvinceProperties extends PlayerActionProperties {
    location: Location;
    /** Refills the province until it holds this many cards. */
    fillTo?: number;
    /** Instead: fills it this many times, each time with the top card of the dynasty deck ("fill a province"). */
    amount?: number;
    faceup?: boolean;
}

export class FillProvinceAction<C extends AbilityContext = AbilityContext> extends PlayerAction<FillProvinceProperties, EventName.Unnamed, C, 'location' | 'fillTo' | 'faceup'> {
    defaultProperties = { location: Location.ProvinceOne, fillTo: 1, faceup: false };
    name = 'fillProvince';
    effect = 'fills {0} with more cards';


    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { fillTo, amount } = this.getProperties(context, additionalProperties);
        return amount === undefined ? ['fills {0} to {1} cards!', [fillTo]] : ['fills {0} with {1} cards', [amount]];
    }

    protected effectMessageTarget(context: C, additionalProperties: ActionOverrides = {}): MsgArg {
        return this.getProperties(context, additionalProperties).location;
    }

    eventHandler(event: PlayerEvent<EventName.Unnamed, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        const player = event.player;
        if(properties.amount !== undefined) {
            for(let i = 0; i < properties.amount; i++) {
                context.game.queueSimpleStep(() => player.putTopDynastyCardInProvince(properties.location, !properties.faceup));
            }
            return;
        }
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
