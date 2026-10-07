import { CardType, Location } from '../../../Constants.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';
import * as costs from '../../../costs/index.js';
import { discardFromPlay, moveCard, multipleContext } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class FortifiedLumberCamp extends DrawCard {
    static id = 'fortified-lumber-camp';

    setupCardAbilities() {
        this.action('Discard all cards in and attached to a province')
            .cost(costs.sacrificeSelf())
            .target({
                location: Location.Provinces,
                cardType: CardType.Province
            })
            .gameAction(multipleContext((context) => ({
                gameActions: [
                    moveCard({
                        destination: Location.DynastyDiscardPile,
                        target: this.cardsInProvince(context.target)
                    }),
                    discardFromPlay({ target: context.target.attachments })
                ]
            })))
            .effect((context) => msg`discard ${this.cardsInProvince(context.target).concat(context.target.attachments)}`);
    }

    private cardsInProvince(targetProvince: ProvinceCard) {
        return targetProvince.controller.getDynastyCardsInProvince(targetProvince.location);
    }
}
