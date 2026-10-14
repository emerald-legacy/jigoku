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

export class PlaceInProvinceAction<C extends AbilityContext = AbilityContext> extends CardGameAction<PlaceInProvinceProperties, EventName.Unnamed, C, 'faceup'> {
    name = 'placeInProvince';
    effect = 'put {0} into a province';
    targetType = [CardType.Character, CardType.Holding, CardType.Event];
    defaultProperties = {
        faceup: true
    };

    canAffect(card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { destination } = this.getProperties(context, additionalProperties);
        return !!destination && card.isDynasty && card.location !== destination &&
            context.game.getProvinceArray().includes(destination) && super.canAffect(card, context, additionalProperties);
    }

    eventHandler(event: CardEvent<EventName.Unnamed, C>, additionalProperties: ActionOverrides = {}): void {
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
