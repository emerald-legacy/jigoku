import DrawCard from '../../DrawCard.js';
import { CardTypes, Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FieldTactician extends DrawCard {
    static id = 'field-tactician';

    setupCardAbilities() {
        this.reaction({
            title: 'Return a card to a deck',
            when: {
                onCardPlayed: (event, context) => event.card.hasTrait('tactic') && event.player === context.player
            },
            target: {
                activePromptTitle: 'Choose a conflict card',
                location: Locations.ConflictDiscardPile,
                cardType: [CardTypes.Character, CardTypes.Attachment, CardTypes.Event],
                controller: Players.Any,
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        const card = context.target as DrawCard;
                        const player = card.owner;
                        player.moveCard(card, Locations.ConflictDeck);
                        const index = player.conflictDeck.indexOf(card);
                        player.conflictDeck.splice(index, 1);
                        const orderedCards = player.conflictDeck.slice(0, 2);
                        orderedCards.push(card);
                        player.conflictDeck.splice(0, 2, ...orderedCards);
                    }
                })
            },
            effect: 'return {0} to {1}\'s conflict deck',
            effectArgs: context => [(context.target as DrawCard).owner]
        });
    }
}


export default FieldTactician;
