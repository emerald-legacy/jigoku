import { msg } from '../../GameChat.js';
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
                cardCondition: (card) => card.isParticipating() && card.hasTrait('bushi')
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
                        message: () => msg`${context.target} is honored due to the delayed effect of ${context.source}`
                    })
                ]
            })))
            .chatText((context) => msg`grant +2${'military'} to ${context.chatTarget()} and honor them, if they win the current conflict`);
    }
}


export default APerfectCut;
