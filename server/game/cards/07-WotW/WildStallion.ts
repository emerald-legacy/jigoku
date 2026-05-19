import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes } from '../../Constants.js';

class WildStallion extends DrawCard {
    static id = 'wild-stallion';

    setupCardAbilities() {
        this.action({
            title: 'Move this and another character to the conflict',
            condition: context => context.game.currentConflict && !context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true,
                gameAction: AbilityDsl.actions.moveToConflict()
            },
            gameAction: AbilityDsl.actions.moveToConflict(),
            effect: 'move {0}{1}{2} into the conflict',
            effectArgs: context => [!context.target || context.target.length === 0 ? '' : ' and ', context.source]
        });
    }
}


export default WildStallion;
