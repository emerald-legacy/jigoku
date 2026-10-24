import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

class UjikTactics extends DrawCard {
    static id = 'ujik-tactics';

    override setupCardAbilities() {
        this.action('Give each non-unique character +1 military during this conflict')
            .condition((context) => context.game.isDuringConflict())
            .cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => !card.isUnique()),
                effect: modifyMilitarySkill(1)
            }))
            .chatText(() => msg`give all non-unique character they control +1${'military'}`);
    }
}


export default UjikTactics;
