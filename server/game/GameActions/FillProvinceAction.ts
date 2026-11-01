import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { type EventName, Location } from '../Constants.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';

export interface FillProvinceProperties extends PlayerActionProperties {
    location: Location;
    /** Refills the province until it holds this many cards. */
    fillTo?: number;
    /** Instead: fills it this many times, each time with the top card of the dynasty deck ("fill a province"). */
    amount?: number;
    faceup?: boolean;
}

export class FillProvinceAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<FillProvinceProperties, EventName.Unnamed, Context, 'location' | 'fillTo' | 'faceup'> {
    override defaultProperties = { location: Location.ProvinceOne, fillTo: 1, faceup: false };
    override name = 'fillProvince';
    override effect = 'fill {0} with more cards';


    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { fillTo, amount } = this.getProperties(context, additionalProperties);
        return amount === undefined ? ['fill {0} up to {1} cards', [fillTo]] : ['fill {0} with {1} cards', [amount]];
    }

    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        return this.getProperties(context, additionalProperties).location;
    }

    override eventHandler(event: PlayerEvent<EventName.Unnamed, Context>, additionalProperties: ActionOverrides = {}): void {
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
