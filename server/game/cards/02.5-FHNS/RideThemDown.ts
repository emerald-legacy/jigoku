import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class RideThemDown extends DrawCard {
    static id = 'ride-them-down';

    setupCardAbilities() {
        this.action({
            title: 'Reduce province strength',
            cost: AbilityDsl.costs.discardImperialFavor(),
            condition: () => this.game.isDuringConflict(),
            effect: 'reduce the strength of an attacked province to 1',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} reduces the strength of {1} to 1',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.setBaseProvinceStrength(1)
                }))
            }))
        });
    }
}


export default RideThemDown;
