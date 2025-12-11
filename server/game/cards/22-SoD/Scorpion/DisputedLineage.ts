import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

export default class DisputedLineage extends DrawCard {
    static id = 'disputed-lineage';

    setupCardAbilities() {
        this.action({
            title: 'Choose a character',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onConflictDeclared: (event) => event.attackers.includes(context.target),
                            onDefendersDeclared: (event) => event.defenders.includes(context.target)
                        },
                        onlyRemoveOnSuccess: true,
                        gameAction: AbilityDsl.actions.discardAtRandom({
                            target: context.player.opponent
                        }),
                        message: '{0} discards a card at random due to the delayed effect of {1}',
                        messageArgs: [context.player.opponent, context.source]
                    }),
                    duration: Durations.UntilEndOfRound,
                }))
            },
            effect: "make {1} discard a card the next time {0} commits to a conflict",
            effectArgs: (context) => [context.player.opponent]
        });
    }

    canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.any(
                (card) => card.getType() === CardTypes.Character && card.hasTrait('courtier')
            ) && super.canPlay(context, playType)
        );
    }
}
