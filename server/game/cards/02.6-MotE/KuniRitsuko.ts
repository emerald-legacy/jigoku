import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class KuniRitsuko extends DrawCard {
    static id = 'kuni-ritsuko';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove a fate',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.removeFate()
            }
        });
    }
}


export default KuniRitsuko;
