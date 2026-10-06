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
                cardCondition: card => card.hasTrait('bushi') && card.isParticipating()
            }, multiple([
                cardLastingEffect({
                    effect: modifyBaseMilitarySkillMultiplier(2)
                }),
                cardLastingEffect(context => ({
                    duration: Duration.UntilEndOfPhase,
                    effect: delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: '{1} {2} sacrificed due to {0}\'s delayed effect',
                        messageArgs: [context.source, context.targets.target, (Array.isArray(context.targets.target) ? context.targets.target.length : 0) > 1 ? 'are' : 'is'],
                        gameAction: sacrifice()
                    })
                }))
            ]))
            .effect('double the base {1} skill of {0} and sacrifice them at the end of the conflict', () => (['military']));
    }
}


export default FuryOfTheDamned;
