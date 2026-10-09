import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
import { dishonor } from '../../GameActions/GameActions.js';

class MagistratesIntervention extends DrawCard {
    static id = 'magistrate-s-intervention';

    setupCardAbilities() {
        this.action('Dishonor a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, dishonor())
            .chatText((context) => msg`dishonor ${context.chatTarget()}${context.player.opponent && context.game.getConflicts(context.player.opponent).filter((conflict) => !conflict.passed).length > 1 ? ', then dishonor it again' : ''}`)
            .afterwardsIf((context) => !!(
                context.player.opponent && context.target?.controller === context.player.opponent &&
                    context.game.getConflicts(context.player.opponent).filter((conflict) => !conflict.passed).length > 1))
            .gameAction(dishonor((context) => ({ target: context.target })));
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.cardsInPlay.some((card) => card.getType() === CardType.Character && (card.hasTrait('courtier') || card.hasTrait('magistrate')))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

export default MagistratesIntervention;
