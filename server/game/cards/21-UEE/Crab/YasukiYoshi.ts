import { unlimited } from '../../../AbilityLimit.js';
import { Decks } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { attachSearchedCard } from '../../attachSearchedCard.js';

export default class YasukiYoshi extends DrawCard {
    static id = 'yasuki-yoshi';

    setupCardAbilities() {
        this.reaction('Search for Writ of Survey')
            .when({ onCharacterEntersPlay: (event, context) => event.card === context.source })
            .deckSearch({
                activePromptTitle: 'Choose a Writ of Survey',
                deck: Decks.ConflictDeck,
                cardCondition: (card) => card.name === 'Writ of Survey',
                selectedCardsHandler: (context, _, [card]) =>
                    attachSearchedCard(context, context.source, card, '{0} receives their {1}', (card) => [context.source, card])
            });

        this.reaction('Cause honor loss to the conflict loser')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            })
            .loseHonor((context) => ({
                target: context.event.conflict.loser
            }))
            .limit(unlimited());
    }
}
