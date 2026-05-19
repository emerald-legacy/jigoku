import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes } from '../../Constants.js';

class CripplingTaxes extends DrawCard {
    static id = 'crippling-taxes';

    setupCardAbilities() {
        this.action({
            title: 'Discard all cards in a province',
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province
            },
            gameAction: AbilityDsl.actions.moveCard(context => ({
                destination: Locations.DynastyDiscardPile,
                target: context.target.controller.getDynastyCardsInProvince(context.target.location)
            })),
            effect: 'discard {1}',
            effectArgs: context => [context.target.controller.getDynastyCardsInProvince(context.target.location)]
        });
    }
}


export default CripplingTaxes;
