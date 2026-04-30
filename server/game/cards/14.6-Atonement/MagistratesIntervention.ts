import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class MagistratesIntervention extends DrawCard {
    static id = 'magistrate-s-intervention';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor a character',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.dishonor(),
                    AbilityDsl.actions.conditional({
                        condition: context =>
                            context.player.opponent && context.target.controller === context.player.opponent &&
                            context.game.getConflicts(context.player.opponent).filter(conflict => !conflict.passed).length > 1,
                        trueGameAction: AbilityDsl.actions.dishonor(),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 }) //do nothing
                    })

                ])
            },
            effect: 'dishonor {0}{1}',
            effectArgs: context => [context.player.opponent && context.game.getConflicts(context.player.opponent).filter(conflict => !conflict.passed).length > 1 ? ', then dishonor it again' : '']
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && (card.hasTrait('courtier') || card.hasTrait('magistrate')))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

export default MagistratesIntervention;
