import * as costs from '../../costs/index.js';
import { moveCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';

class Rebuild extends DrawCard {
    static id = 'rebuild';

    setupCardAbilities() {
        this.action('Put a holding into play from your discard')
            .cost(costs.shuffleIntoDeck({
                location: Location.Provinces,
                cardCondition: card => !!card.controller.getProvinceCardInProvince(card.location) && !card.controller.getProvinceCardInProvince(card.location)?.isBroken
            }))
            .target({
                activePromptTitle: 'Choose a holding to put into the province',
                cardType: CardType.Holding,
                location: Location.DynastyDiscardPile,
                controller: Players.Self
            }, moveCard((context) => ({
                destination: context.costs.moveStateWhenChosen instanceof DrawCard ? context.costs.moveStateWhenChosen.location : Location.ProvinceOne,
                facedown: false
            })))
            .effect('replace it with {0}')
            .cannotTargetFirst()
            .cannotBeMirrored();
    }
}


export default Rebuild;
