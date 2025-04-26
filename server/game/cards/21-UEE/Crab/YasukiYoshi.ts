import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import { Decks } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class YasukiYoshi extends DrawCard {
    static id = 'yasuki-yoshi';

    setupCardAbilities() {
        this.reaction({
            title: 'Search for Writ of Survey',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a Writ of Survey',
                deck: Decks.ConflictDeck,
                cardCondition: (card) => card.name === 'Writ of Survey',
                selectedCardsHandler: (context, _, [card]) => {
                    if (card == null) return;

                    context.game.addMessage('{0} receives their {1}', context.source, card);
                    context.game.queueSimpleStep(() =>
                        AbilityDsl.actions.attach({ target: context.source, attachment: card }).resolve(null, context)
                    );
                }
            })
        });

        this.reaction({
            title: 'Cause honor loss to the conflict loser',
            when: {
                afterConflict: (event, context) =>
                    (event.conflict as undefined | Conflict)?.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.loseHonor((context) => ({
                target: (context.game.currentConflict as undefined | Conflict)?.loser
            })),
            limit: AbilityDsl.limit.unlimited()
        });
    }
}
