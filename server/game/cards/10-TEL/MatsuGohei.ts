import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class MatsuGohei extends DrawCard {
    static id = 'matsu-gohei';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking() &&
                            context.player.cardsInPlay
                                .filter(card => card.hasTrait('bushi') &&
                                    card !== context.source &&
                                    card.isAttacking()).length >= 2,

            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}


export default MatsuGohei;
