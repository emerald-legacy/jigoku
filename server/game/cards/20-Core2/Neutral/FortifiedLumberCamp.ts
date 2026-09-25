import { CardType, Location } from '../../../Constants.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class FortifiedLumberCamp extends DrawCard {
    static id = 'fortified-lumber-camp';

    setupCardAbilities() {
        this.action('Discard all cards in and attached to a province ')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target('target', {
                location: Location.Provinces,
                cardType: CardType.Province
            })
            .gameAction(AbilityDsl.actions.multipleContext((context) => ({
                gameActions: context.target ? [
                    AbilityDsl.actions.moveCard({
                        destination: Location.DynastyDiscardPile,
                        target: this.#cardsInProvince(context.target)
                    }),
                    AbilityDsl.actions.discardFromPlay({ target: context.target.attachments })
                ] : []
            })))
            .effect('discard {1}', (context) => [context.target ? this.#cardsInProvince(context.target).concat(context.target.attachments) : []]);
    }

    #cardsInProvince(targetProvince: ProvinceCard) {
        return targetProvince.controller.getDynastyCardsInProvince(targetProvince.location);
    }
}
