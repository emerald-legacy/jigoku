import { Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { attachmentSearch } from '../../attachmentSearch.js';
import { msg } from '../../../GameChat.js';
import { topCards } from '../../topCards.js';

export default class ExcellenceAttained extends ProvinceCard {
    static id = 'excellence-attained';

    override setupCardAbilities() {
        this.reaction('Search for an attachment')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source && context.player.conflictDeck.length > 0
            })
            .gameAction(attachmentSearch({ controller: Players.Any, maxCost: 1 }))
            .chatText((context) => msg`search the ${topCards(5, context.player.conflictDeck.length)} of their conflict deck for an attachment and put it into play`);
    }
}
