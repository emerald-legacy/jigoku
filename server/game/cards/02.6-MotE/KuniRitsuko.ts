import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KuniRitsuko extends DrawCard {
    static id = 'kuni-ritsuko';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Remove a fate')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isAttacking()
            }, ability.actions.removeFate());
    }
}


export default KuniRitsuko;
