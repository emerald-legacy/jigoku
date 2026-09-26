import AbilityDsl from '../../../abilitydsl.js';
import { Decks } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class YasukiYoshi extends DrawCard {
    static id = 'yasuki-yoshi';

    setupCardAbilities() {
        this.reaction('Search for Writ of Survey')
            .when({ onCharacterEntersPlay: (event, context) => event.card === context.source })
            .gameAction(AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a Writ of Survey',
                deck: Decks.ConflictDeck,
                cardCondition: (card) => card.name === 'Writ of Survey',
                selectedCardsHandler: (context, _, [card]) => {
                    if(card === null || card === undefined) {
                        return;
                    }

                    context.game.addMessage('{0} receives their {1}', context.source, card);
                    context.game.queueSimpleStep(() =>
                        AbilityDsl.actions.attach({ target: context.source, attachment: card }).resolve(undefined, context)
                    );
                }
            }));

        this.reaction('Cause honor loss to the conflict loser')
            .when({
                afterConflict: (event, context) =>
                    event.conflict?.winner === context.source.controller &&
                    context.source.isParticipating()
            })
            .gameAction(AbilityDsl.actions.loseHonor((context) => ({
                target: context.game.currentConflict?.loser
            })))
            .limit(AbilityDsl.limit.unlimited());
    }
}
