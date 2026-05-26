import { CardTypes, Durations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class DisputedLineage extends DrawCard {
    static id = 'disputed-lineage';

    setupCardAbilities() {
        this.action({
            title: 'Choose a character',
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.loseFaction(context.target.printedFaction),
                        duration: Durations.UntilEndOfRound
                    })),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        duration: Durations.UntilEndOfRound,
                        targetController: context.target.controller,
                        condition: () => context.target.isParticipating(),
                        effect: AbilityDsl.effects.playerCannot({
                            cannot: 'honor'
                        })
                    }))
                ])
            },
            effect: 'remove {0}\'s printed faction and prevent {1} from honoring characters while {0} is participating in a conflict',
            effectArgs: (context) => [context.player.opponent].filter((p): p is NonNullable<typeof p> => p !== undefined),
            then: context => ({
                thenCondition: () => context?.player.imperialFavor !== '',
                message: '{0} draws a card',
                gameAction: AbilityDsl.actions.draw({
                    target: context?.player,
                    amount: 1
                })
            })
        });
    }

    canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card) => card.getType() === CardTypes.Character && card.hasTrait('courtier')
            ) && super.canPlay(context, playType)
        );
    }
}
