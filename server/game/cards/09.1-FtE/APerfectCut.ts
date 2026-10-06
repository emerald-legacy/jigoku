import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType, Players } from '../../Constants.js';
import { delayedEffect, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect, honor } from '../../GameActions/GameActions.js';

class APerfectCut extends DrawCard {
    static id = 'a-perfect-cut';

    setupCardAbilities() {
        this.conflictAction('Increase a character\'s military skill', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi')
            }, cardLastingEffect((context) => ({
                effect: [
                    modifyMilitarySkill(2),
                    delayedEffect({
                        when: {
                            afterConflict: (event) =>
                                context.target.isParticipating() &&
                                    context.target.controller === event.conflict.winner
                        },
                        gameAction: honor(),
                        message: '{0} is honored due to the delayed effect of {1}',
                        messageArgs: [context.target, context.source]
                    })
                ]
            })))
            .effect('grant +2{1} to {0} and honor them, if they win the current conflict', () => (['military']));
    }
}


export default APerfectCut;
