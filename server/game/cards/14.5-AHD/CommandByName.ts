import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { setBaseProvinceStrength } from '../../effects.js';
import { cardLastingEffect, selectCard } from '../../GameActions/GameActions.js';

class CommandByName extends DrawCard {
    static id = 'command-by-name';

    setupCardAbilities() {
        this.action('Reduce province strength')
            .cost(AbilityDsl.costs.payHonor(1))
            .cost(AbilityDsl.costs.discardCard({ location: Location.Hand }))
            .condition((context) => context.game.isDuringConflict())
            .gameAction(selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} reduces the strength of {1} to 0',
                messageArgs: cards => [context.player, cards],
                gameAction: cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: setBaseProvinceStrength(0)
                }))
            })))
            .effect('reduce the strength of an attacked province to 0');
    }
}


export default CommandByName;
