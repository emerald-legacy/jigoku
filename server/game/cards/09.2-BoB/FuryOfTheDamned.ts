import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, Duration, TargetMode } from '../../Constants.js';
import { delayedEffect, modifyBaseMilitarySkillMultiplier } from '../../effects.js';
import { cardLastingEffect, multiple, sacrifice } from '../../GameActions/GameActions.js';

class FuryOfTheDamned extends DrawCard {
    static id = 'fury-of-the-damned';

    setupCardAbilities() {
        this.action('Double the base military skill')
            .targetCards({
                activePromptTitle: 'Choose bushi characters',
                mode: TargetMode.Unlimited,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi') && card.isParticipating()
            }, multiple([
                cardLastingEffect({
                    effect: modifyBaseMilitarySkillMultiplier(2)
                }),
                cardLastingEffect((context) => ({
                    duration: Duration.UntilEndOfPhase,
                    effect: delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: () => msg`${context.targets.target} ${(Array.isArray(context.targets.target) ? context.targets.target.length : 0) > 1 ? 'are' : 'is'} sacrificed due to ${context.source}'s delayed effect`,
                        gameAction: sacrifice()
                    })
                }))
            ]))
            .chatText((context) => msg`double the base ${'military'} skill of ${context.chatTarget()} and sacrifice them at the end of the conflict`);
    }
}


export default FuryOfTheDamned;
