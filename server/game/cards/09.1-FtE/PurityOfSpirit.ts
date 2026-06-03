import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, CardType } from '../../Constants.js';

class PurityOfSpirit extends DrawCard {
    static id = 'purity-of-spirit';

    setupCardAbilities() {
        this.action({
            title: 'Choose a bushi character to honor',

            effect: 'honor {0}. Their status token will be discarded at the end of the conflict',
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('bushi') && card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        duration: Duration.UntilEndOfPhase,
                        effect: AbilityDsl.effects.delayedEffect({
                            when : {
                                onConflictFinished: () => true
                            },
                            message: '{0} {3} removed from {1} due to the delayed effect of {2}',
                            messageArgs: [context.target.statusTokens, context.target, context.source, context.target.statusTokens.length > 1 ? 'are' : 'is'],
                            gameAction: AbilityDsl.actions.discardStatusToken(() => ({ target: context.target.statusTokens }))
                        })
                    }))
                ])
            }
        });
    }
}


export default PurityOfSpirit;
