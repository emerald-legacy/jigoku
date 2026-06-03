import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';

class Rebuild extends DrawCard {
    static id = 'rebuild';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Put a holding into play from your discard',
            cost: ability.costs.shuffleIntoDeck({
                location: Location.Provinces,
                cardCondition: (card: any) => card.controller.getProvinceCardInProvince(card.location) && !card.controller.getProvinceCardInProvince(card.location).isBroken
            }),
            target: {
                activePromptTitle: 'Choose a holding to put into the province',
                cardType: CardType.Holding,
                location: Location.DynastyDiscardPile,
                controller: Players.Self,
                gameAction: ability.actions.moveCard((context: AbilityContext) => ({
                    destination: context.costs.moveStateWhenChosen ? (context.costs.moveStateWhenChosen as DrawCard).location : Location.ProvinceOne,
                    facedown: false
                }))
            },
            cannotTargetFirst: true,
            cannotBeMirrored: true,
            effect: 'replace it with {0}'
        });
    }
}


export default Rebuild;
