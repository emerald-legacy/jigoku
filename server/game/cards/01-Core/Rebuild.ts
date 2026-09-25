import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';

class Rebuild extends DrawCard {
    static id = 'rebuild';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Put a holding into play from your discard')
            .cost(ability.costs.shuffleIntoDeck({
                location: Location.Provinces,
                cardCondition: card => !!card.controller.getProvinceCardInProvince(card.location) && !card.controller.getProvinceCardInProvince(card.location)?.isBroken
            }))
            .target('target', {
                activePromptTitle: 'Choose a holding to put into the province',
                cardType: CardType.Holding,
                location: Location.DynastyDiscardPile,
                controller: Players.Self
            }, ability.actions.moveCard((context) => ({
                destination: context.costs.moveStateWhenChosen ? (context.costs.moveStateWhenChosen as DrawCard).location : Location.ProvinceOne,
                facedown: false
            })))
            .effect('replace it with {0}')
            .cannotTargetFirst()
            .cannotBeMirrored();
    }
}


export default Rebuild;
