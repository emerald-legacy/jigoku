import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class FallenInBattle extends DrawCard {
    static id = 'fallen-in-battle';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Discard a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' &&
                                                   event.conflict.skillDifference >= 5
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            },
            max: ability.limit.perConflict(1)
        });
    }
}


export default FallenInBattle;
