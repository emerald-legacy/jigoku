import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class InsultToInjury extends DrawCard {
    static id = 'insult-to-injury';

    setupCardAbilities() {
        this.reaction('Dishonor the loser of a duel')
            .when({
                afterDuel: (event, context) =>
                    event.winner?.some(
                        (card) => card.controller === context.player && card.hasTrait('duelist')
                    ) ?? false
            })
            .gameAction(AbilityDsl.actions.conditional((context) => {
                const losers = context.event.loser ?? [];
                return {
                    condition: losers.length > 1,
                    trueGameAction: AbilityDsl.actions.cardMenu({
                        activePromptTitle: 'Choose a character to dishonor',
                        cards: losers,
                        gameAction: AbilityDsl.actions.dishonor(),
                        message: '{0} chooses to dishonor {1}',
                        messageArgs: (card, player) => [player, card]
                    }),
                    falseGameAction: AbilityDsl.actions.dishonor({ target: losers[0] })
                };
            }))
            .effect('{1}', (context) => {
                const loser = context.event.loser;
                return [
                    (loser?.length ?? 0) > 1
                        ? 'choose to dishonor a loser of the duel'
                        : ['dishonor {0}', loser ?? []]
                ];
            });
    }
}
