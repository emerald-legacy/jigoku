import { msg } from '../../../GameChat.js';
import { CardType, Players, ConflictType } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { atEndOfConflict, cardLastingEffect, multiple, sacrifice } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const CHARACTER = 'character';

export default class ForDeathAndGlory extends DrawCard {
    static id = 'for-death-and-glory-';

    override setupCardAbilities() {
        this.conflictAction('Increase a character\'s military skill', { conflictType: ConflictType.Military })
            .target({
                name: CHARACTER,
                controller: Players.Self,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: CHARACTER
            }, {
                'Gain +2 skill': {
                    action: cardLastingEffect((context) => ({
                        target: context.targets[CHARACTER],
                        effect: modifyMilitarySkill(2)
                    })),
                    chatText: (context) => msg`${'grant 2 military skill to '}${context.targets[CHARACTER]}`
                },
                'Gain +4 skill, and get discarded when the conflict ends': {
                    action: multiple([
                        cardLastingEffect((context) => ({
                            target: context.targets[CHARACTER],
                            effect: modifyMilitarySkill(4)
                        })),
                        atEndOfConflict((context) => ({
                            target: context.targets[CHARACTER],
                            message: () => msg`${context.targets[CHARACTER]} is discarded from play due to the delayed effect of ${context.source}`,
                            gameAction: sacrifice({
                                target: context.targets[CHARACTER]
                            })
                        }))
                    ]),
                    chatText: (context) => msg`${'grant 4 military skill to '}${context.targets[CHARACTER]}, sacrificing them at the end of the conflict`
                }
            })
            .max(perConflict(1));
    }
}
