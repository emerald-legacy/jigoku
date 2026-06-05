import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Duration, Players, AbilityType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class StrangeMirror extends DrawCard {
    static id = 'strange-mirror';

    public setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Put a copy of a character into play',
                condition: (context: AbilityContext) => (context.source as DrawCard).isParticipating(),
                targets: {
                    inPlay: {
                        cardType: CardType.Character,
                        controller: Players.Opponent,
                        cardCondition: card => card.isParticipating()
                    },
                    inDiscard: {
                        dependsOn: 'inPlay',
                        cardCondition: (card, context) => card.name === context.targets.inPlay.name,
                        activePromptTitle: 'Choose a character from a discard pile',
                        location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                        controller: Players.Any,
                        gameAction: AbilityDsl.actions.joint([
                            AbilityDsl.actions.putIntoConflict(context => ({
                                target: context.targets.inDiscard
                            })),
                            AbilityDsl.actions.cardLastingEffect(context => ({
                                target: context.targets.inDiscard,
                                duration: Duration.UntilEndOfPhase,
                                location: [Location.DynastyDiscardPile, Location.PlayArea],
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
                effectArgs: (context: AbilityContext) => [context.targets.inDiscard]
            })
        });
    }
}
