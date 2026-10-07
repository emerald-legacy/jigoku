import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyMilitarySkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

export default class YojinNoShiro extends StrongholdCard {
    static id = 'yojin-no-shiro';

    setupCardAbilities() {
        this.action('Give attacking characters +1/+0')
            .cost(AbilityDsl.costs.bowSelf())
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.isAttacking()),
                effect: modifyMilitarySkill(1)
            }))
            .effect(() => msg`give attacking characters +1${'military'}/+0${'political'}`);
    }
}
