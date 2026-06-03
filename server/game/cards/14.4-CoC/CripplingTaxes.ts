import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';

class CripplingTaxes extends DrawCard {
    static id = 'crippling-taxes';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Discard all cards in a province',
            target: {
                location: Location.Provinces,
                cardType: CardType.Province
            },
            gameAction: AbilityDsl.actions.moveCard<DrawCard>(context => ({
                destination: Location.DynastyDiscardPile,
                target: context.target?.controller.getDynastyCardsInProvince(context.target.location)
            })),
            effect: 'discard {1}',
            effectArgs: context => [context.target?.controller.getDynastyCardsInProvince(context.target.location) ?? []]
        });
    }
}


export default CripplingTaxes;
