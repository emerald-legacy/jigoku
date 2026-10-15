import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { doesNotBow } from '../../effects.js';

class MatsuGohei extends DrawCard {
    static id = 'matsu-gohei';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking() &&
                            context.player.cardsInPlay
                                .filter((card) => card.hasTrait(Trait.Bushi) &&
                                    card !== context.source &&
                                    card.isAttacking()).length >= 2,

            effect: doesNotBow()
        });
    }
}


export default MatsuGohei;
