import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class InsultToInjury extends DrawCard {
    static id = 'insult-to-injury';

    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor the loser of a duel',
            when: {
                afterDuel: (event, context) =>
                    event.winner?.some(
                        (card) => card.controller === context.player && card.hasTrait('duelist')
                    ) ?? false
            },
            gameAction: AbilityDsl.actions.conditional({
                condition: (context: AbilityContext) => ((context as TriggeredAbilityContext).event.loser?.length ?? 0) > 1,
                trueGameAction: AbilityDsl.actions.cardMenu((context) => ({
                    activePromptTitle: 'Choose a character to dishonor',
                    cards: context.event.loser ?? [],
                    gameAction: AbilityDsl.actions.dishonor(),
                    message: '{0} chooses to dishonor {1}',
                    messageArgs: (card, player) => [player, card]
                })),
                falseGameAction: AbilityDsl.actions.dishonor((context) => ({ target: context.event.loser?.[0] }))
            }),
            effect: '{1}',
            effectArgs: (context) => {
                const loser = context.event.loser;
                return [
                    (loser?.length ?? 0) > 1
                        ? 'choose to dishonor a loser of the duel'
                        : ['dishonor {0}', loser ?? []]
                ];
            }
        });
    }
}
