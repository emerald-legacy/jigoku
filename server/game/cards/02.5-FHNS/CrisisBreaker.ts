import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class CrisisBreaker extends DrawCard {
    static id = 'crisis-breaker';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Ready and bring into play')
            .condition(context => {
                if(this.game.isDuringConflict('military') && this.game.currentConflict) {
                    let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                    return context.player.isAttackingPlayer() ? diff < 0 : diff > 0;
                }
                return false;
            })
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('berserker')
            }, ability.actions.ready(), ability.actions.moveToConflict())
            .effect('ready {0} and move it into the conflict');
    }
}


export default CrisisBreaker;
