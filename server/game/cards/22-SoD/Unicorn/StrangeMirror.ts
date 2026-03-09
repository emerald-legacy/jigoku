import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Durations, Players, AbilityTypes, Locations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class StrangeMirror extends DrawCard {
    static id = 'strange-mirror';

    public setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Put a copy of a character into play',
                condition: context => context.source.isParticipating(),
                targets: {
                    inPlay: {
                        cardType: CardTypes.Character,
                        controller: Players.Opponent,
                        cardCondition: card => card.isParticipating(),
                    },
                    inDiscard: {
                        dependsOn: 'inPlay',
                        cardCondition: (card, context) => card.name === context.targets.inPlay.name,
                        activePromptTitle: 'Choose a character from a discard pile',
                        location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                        controller: Players.Any,
                        gameAction: AbilityDsl.actions.joint([
                            AbilityDsl.actions.putIntoConflict(context => ({
                                target: context.targets.inDiscard
                            })),
                            AbilityDsl.actions.cardLastingEffect(context => ({
                                target: context.targets.inDiscard,
                                duration: Durations.UntilEndOfPhase,
                                location: [Locations.DynastyDiscardPile, Locations.PlayArea],
                                effect: AbilityDsl.effects.delayedEffect({
                                    when: {
                                        onConflictFinished: () => true
                                    },
                                    message: '{1} is removed from the game due to the delayed effect of {0}',
                                    messageArgs: [context.source, context.targets.inDiscard],
                                    gameAction: AbilityDsl.actions.removeFromGame()
                                })
                            }))
                        ])
                    }
                },
                effect: 'put {1} into play in the conflict, removing it from the game when the conflict ends',
                effectArgs: context => [context.targets.inDiscard]
            })
        });
    }
}
