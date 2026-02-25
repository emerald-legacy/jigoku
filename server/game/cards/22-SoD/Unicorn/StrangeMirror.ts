import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Durations, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class StrangeMirror extends DrawCard {
    static id = 'strange-mirror';

    public setupCardAbilities() {
        this.action({
            title: 'Turn character into a copy',
            targets: {
                oppCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player),
                    gameAction: AbilityDsl.actions.noAction()
                },
                myCharacter: {
                    dependsOn: 'oppCharacter',
                    cardCondition: (card, context) => !card.isParticipating() && card.isUnique() === context.targets.oppCharacter.isUnique(),
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.copyCard(context.targets.oppCharacter),
                        duration: Durations.Custom,
                        until: {
                            onRoundEnded: () => true,
                            onConflictFinished: () => true
                        }
                    }))
                }
            },
            effect: 'turn {1} into a copy of {2}',
            effectArgs: context => [context.targets.myCharacter, context.targets.oppCharacter],
            max: AbilityDsl.limit.perRound(1),
            then: context => ({
                thenCondition: () => context.targets.oppCharacter.isUnique(),
                gameAction: AbilityDsl.actions.discardFromPlay({
                    target: context.source
                }),
                message: '{3} is discarded because the chosen characters are unique',
                messageArgs: _thenContext => [context.source]
            })
        });
    }
}
