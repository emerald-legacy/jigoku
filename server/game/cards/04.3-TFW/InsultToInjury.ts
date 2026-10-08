import { msg } from '../../GameChat.js';
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
            .chatText((context) => {
                const loser = context.event.loser;
                return (loser?.length ?? 0) > 1
                    ? msg`choose to dishonor a loser of the duel`
                    : msg`dishonor ${loser ?? []}`;
            })
            .if((context) => (context.event.loser ?? []).length > 1)
                .gameAction(cardMenu((context) => ({
                    activePromptTitle: 'Choose a character to dishonor',
                    cards: context.event.loser ?? [],
                    gameAction: dishonor(),
                    message: (_context, card, player) => msg`${player} chooses to dishonor ${card}`
                })))
            .otherwise()
                .dishonor((context) => ({ target: context.event.loser?.[0] }));
    }
}
