import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HidaTomonatsu extends DrawCard {
    static id = 'hida-tomonatsu';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Return a character to deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isAttacking() && !card.isUnique(),
                gameAction: ability.actions.returnToDeck()
            }
        });
    }
}


export default HidaTomonatsu;
