import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MagistratesIntervention extends DrawCard {
    static id = 'magistrate-s-intervention';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor a character',
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.dishonor(),
                    AbilityDsl.actions.conditional({
                        condition: (context: AbilityContext) => !!(
                            context.player.opponent && (context.target as DrawCard).controller === context.player.opponent &&
                            context.game.getConflicts(context.player.opponent).filter(conflict => !conflict.passed).length > 1),
                        trueGameAction: AbilityDsl.actions.dishonor(),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 }) //do nothing
                    })

                ])
            },
            effect: 'dishonor {0}{1}',
            effectArgs: (context: AbilityContext) => [context.player.opponent && context.game.getConflicts(context.player.opponent).filter(conflict => !conflict.passed).length > 1 ? ', then dishonor it again' : '']
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardType.Character && (card.hasTrait('courtier') || card.hasTrait('magistrate')))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

export default MagistratesIntervention;
