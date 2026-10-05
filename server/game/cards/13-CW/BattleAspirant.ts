import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType, Duration, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

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
            }, AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfConflict,
                effect: AbilityDsl.effects.mustBeDeclaredAsDefender()
            }))
            .effect('force {0} to declare as a defender this conflict');
    }
}


export default BattleAspirant;
