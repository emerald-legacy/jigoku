import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { Location, Players, CardType, ConflictType } from '../../Constants.js';

class IkomaEiji extends DrawCard {
    static id = 'ikoma-eiji';

    setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === ConflictType.Political
            })
            .selectCard({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.DynastyDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.isCharacter() && card.hasTrait('bushi') && card.costLessThan(4),
                message: (context, card) => msg`${context.player} puts ${card} into play with ${context.source}'s ability`,
                gameAction: putIntoPlay()
            })
            .chatText('put a character into play');
    }
}


export default IkomaEiji;
