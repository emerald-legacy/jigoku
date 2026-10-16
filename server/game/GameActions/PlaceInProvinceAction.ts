import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, type EventName, Location } from '../Constants.js';
import { type CardActionProperties, type CardEvent, CardGameAction } from './CardGameAction.js';
import type { ActionOverrides } from './GameAction.js';

export interface PlaceInProvinceProperties extends CardActionProperties {
    /** The province's location, among the card owner's provinces. */
    destination?: Location;
    /** First discards the dynasty cards in that province: all of them, or these. */
    discard?: 'all' | BaseCard[];
    faceup?: boolean;
}

export class PlaceInProvinceAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<PlaceInProvinceProperties, EventName.Unnamed, Context, 'faceup'> {
    override name = 'placeInProvince';
    override effect = 'put {0} into a province';
    override targetType = [CardType.Character, CardType.Holding, CardType.Event];
    override defaultProperties = {
        faceup: true
    };

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { destination } = this.getProperties(context, additionalProperties);
        return !!destination && card.isDynasty && card.location !== destination &&
            context.game.getProvinceArray().includes(destination) && super.canAffect(card, context, additionalProperties);
    }

    override eventHandler(event: CardEvent<EventName.Unnamed, Context>, additionalProperties: ActionOverrides = {}): void {
        const card = event.card;
        const { destination, discard, faceup } = this.getProperties(event.context, additionalProperties);
        if(!card.isDrawCard() || !destination) {
            return;
        }
        const owner = card.owner;
        const toDiscard: BaseCard[] = discard === 'all' ? owner.getDynastyCardsInProvince(destination) : (discard ?? []);
        if(card.location === Location.UnderneathStronghold && owner.stronghold) {
            owner.stronghold.removeChildCard(card, destination);
        } else {
            owner.moveCard(card, destination);
        }
        if(faceup) {
            card.facedown = false;
        }
        for(const other of toDiscard) {
            if(other !== card) {
                owner.moveCard(other, Location.DynastyDiscardPile);
            }
        }
    }
}
