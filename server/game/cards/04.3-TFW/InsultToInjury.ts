import { cardMenu, dishonor } from '../../GameActions/GameActions.js';
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
            .effect('{1}', (context) => {
                const loser = context.event.loser;
                return [
                    (loser?.length ?? 0) > 1
                        ? 'choose to dishonor a loser of the duel'
                        : ['dishonor {0}', loser ?? []]
                ];
            })
            .if((context) => (context.event.loser ?? []).length > 1)
                .gameAction(cardMenu((context) => ({
                    activePromptTitle: 'Choose a character to dishonor',
                    cards: context.event.loser ?? [],
                    gameAction: dishonor(),
                    message: '{0} chooses to dishonor {1}',
                    messageArgs: (card, player) => [player, card]
                })))
            .otherwise()
                .dishonor((context) => ({ target: context.event.loser?.[0] }));
    }
}
