import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FieldTactician extends DrawCard {
    static id = 'field-tactician';

    setupCardAbilities() {
        this.reaction('Return a card to a deck')
            .when({
                onCardPlayed: (event, context) => event.card.hasTrait('tactic') && event.player === context.player
            })
            .target('target', {
                activePromptTitle: 'Choose a conflict card',
                location: Location.ConflictDiscardPile,
                cardType: [CardType.Character, CardType.Attachment, CardType.Event],
                controller: Players.Any
            }, AbilityDsl.actions.handler({
                handler: context => {
                    const card = context.target;
                    if(!card?.isDrawCard()) {
                        return;
                    }
                    const player = card.owner;
                    player.moveCard(card, Location.ConflictDeck);
                    const index = player.conflictDeck.indexOf(card);
                    player.conflictDeck.splice(index, 1);
                    const orderedCards = player.conflictDeck.slice(0, 2);
                    orderedCards.push(card);
                    player.conflictDeck.splice(0, 2, ...orderedCards);
                }
            }))
            .effect('return {0} to {1}\'s conflict deck', context => [context.target?.owner ?? '']);
    }
}


export default FieldTactician;
