import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TalismanOfTheSun extends DrawCard {
    static id = 'talisman-of-the-sun';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move conflict to a different province',
            condition: context => context.player.isDefendingPlayer(),
            cost: ability.costs.bowSelf(),
            gameAction: AbilityDsl.actions.selectCard(context => ({
                cardType: CardType.Province,
                location: Location.Provinces,
                gameAction: AbilityDsl.actions.moveConflict(),
                message: '{0} moves the conflict to {1}',
                messageArgs: card => [context.player, card]
            })),
            effect: 'move the conflict to another eligible province'
        });
    }
}


export default TalismanOfTheSun;
