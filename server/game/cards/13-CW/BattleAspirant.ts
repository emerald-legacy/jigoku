import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType, Players } from '../../Constants.js';
import { mustBeDeclaredAsDefender } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class BattleAspirant extends DrawCard {
    static id = 'battle-aspirant';

    setupCardAbilities() {
        this.reaction('Force a character to defend')
            .when({
                onConflictDeclared: (event, context) => event.attackers?.includes(context.source) && this.game.isDuringConflict(ConflictType.Military)
            })
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: card => !card.hasKeyword('covert')
            }, cardLastingEffect({
                effect: mustBeDeclaredAsDefender()
            }))
            .effect('force {0} to declare as a defender this conflict');
    }
}


export default BattleAspirant;
