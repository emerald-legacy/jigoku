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
            .selectCard(context => ({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.DynastyDiscardPile],
                controller: Players.Self,
                cardCondition: card => card.isCharacter() && card.hasTrait('bushi') && card.costLessThan(4),
                message: '{0} puts {1} into play with {2}\'s ability',
                messageArgs: card => [context.player, card, context.source],
                gameAction: putIntoPlay()
            }))
            .effect('put a character into play');
    }
}


export default IkomaEiji;
