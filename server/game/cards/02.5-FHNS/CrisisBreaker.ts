import { moveToConflict, ready } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType, Trait } from '../../Constants.js';

class CrisisBreaker extends DrawCard {
    static id = 'crisis-breaker';

    override setupCardAbilities() {
        this.action('Ready and bring into play')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .ifCondition((context) => {
                const conflict = context.game.currentConflict;
                if(!conflict) {
                    return false;
                }
                const diff = conflict.attackerSkill - conflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff < 0 : diff > 0;
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Berserker)
            }, ready(), moveToConflict())
            .chatText('ready {0} and move it into the conflict');
    }
}


export default CrisisBreaker;
