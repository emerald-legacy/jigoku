import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Durations } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class FieldsOfRollingThunder extends DrawCard {
    static id = 'fields-of-rolling-thunder';

    public setupCardAbilities() {
        this.forcedReaction({
            title: 'Discard this holding',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player && event.conflict.conflictUnopposed
            },
            gameAction: AbilityDsl.actions.discardFromPlay()
        });

        this.action({
            title: 'Honor a character',

            effect: 'honor {0}. They will be dishonored at the end of the conflict if {1} loses the conflict.',
            effectArgs: (context) => [context.source.controller],
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating() && card.isFaction('unicorn'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.cardLastingEffect((context) => {
                        const conflictWhenItWasTriggered = this.game.currentConflict;
                        return {
                            duration: Durations.UntilEndOfPhase,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onConflictFinished: (event: any, context: TriggeredAbilityContext) =>
                                        event.conflict === conflictWhenItWasTriggered &&
                                        event.conflict.winner === context.player.opponent
                                },
                                gameAction: AbilityDsl.actions.dishonor({ target: context.target })
                            })
                        };
                    })
                ])
            }
        });
    }
}
