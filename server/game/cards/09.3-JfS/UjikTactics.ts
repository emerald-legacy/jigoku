import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class UjikTactics extends DrawCard {
    static id = 'ujik-tactics';

    setupCardAbilities() {
        this.conflictAction('Give each non-unique character +1 military during this conflict')
            .gameAction(cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter((card) => !card.isUnique()),
                effect: modifyMilitarySkill(1)
            })))
            .effect(() => msg`give all non-unique character they control +1${'military'}`);
    }
}


export default UjikTactics;
