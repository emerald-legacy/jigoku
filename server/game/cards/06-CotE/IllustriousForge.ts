import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { attachmentSearch } from '../attachmentSearch.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

export default class IllustriousForge extends ProvinceCard {
    static id = 'illustrious-forge';

    override setupCardAbilities() {
        this.reaction('Search for an attachment')
            .when({
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.conflictDeck.length > 0
            })
            .gameAction(attachmentSearch({ controller: Players.Self }))
            .chatText((context) => msg`search the ${topCards(5, context.player.conflictDeck.length)} of their conflict deck for an attachment and put it into play`);
    }
}
