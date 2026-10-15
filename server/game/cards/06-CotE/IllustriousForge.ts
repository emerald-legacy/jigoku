import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { attachmentSearch } from '../attachmentSearch.js';

export default class IllustriousForge extends ProvinceCard {
    static id = 'illustrious-forge';

    setupCardAbilities() {
        this.reaction('Search for an attachment')
            .when({
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.conflictDeck.length > 0
            })
            .gameAction(attachmentSearch({ controller: Players.Self }))
            .chatText('search the top 5 cards of their conflict deck for an attachment and put it into play');
    }
}
