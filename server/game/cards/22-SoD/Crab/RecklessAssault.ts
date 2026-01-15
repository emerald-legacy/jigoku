import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import { EffectNames, TargetModes, Locations, CardTypes, Players, Durations } from '../../../Constants';

export default class RecklessAssault extends DrawCard {
    static id = 'reckless-assault';

    setupCardAbilities() {
        this.reaction({
            title: 'Force defenders',
            when: {
                onConflictDeclared: (event, context) =>
                    context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 &&
                    context.game.currentConflict.getParticipants(
                        (participant) => participant.hasTrait('berserker') && participant.controller === context.player
                    ).length === 1 &&
                    context.player === context.game.currentConflict.attackingPlayer &&
                    !context.game.currentConflict.attackingPlayer.anyEffect(EffectNames.DefendersChosenFirstDuringConflict)
            },
            effect: 'bow {0} if neither of them defend',
            target: {
                mode: TargetModes.Exactly,
                activePromptTitle: 'Choose characters',
                numCards: 2,
                cardType: CardTypes.Character,
                location: Locations.PlayArea,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    duration: Durations.UntilEndOfConflict,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onDefendersDeclared: (event, _) => {
                                const targets = context.target;
                                const defenders = event.conflict.defenders;
                                let isTargetADefender = false;
                                targets.forEach(target => {
                                    if(defenders.includes(target)) {
                                        isTargetADefender = true;
                                    }
                                });
                                return !isTargetADefender;
                            }
                        },
                        gameAction: AbilityDsl.actions.bow(),
                        message: '{0} are bowed due to the delayed effect of {1}',
                        messageArgs: [context.target, context.source]
                    })
                }))
            }
        });
    }
}
